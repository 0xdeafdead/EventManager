import { JWTService } from '@app/jwt';
import mongoose, { Model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';
import { catchError, from, Observable, switchMap } from 'rxjs';
import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

import { Credential, SessionData, User } from '../../types';
import { SignInInput } from './dto/signIn.input';
import { SignUpInput } from './dto/signUp.input';
import { UserService } from '../user/user.service';
import errorHandler from '../../utils/errrorHandler';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Credential.name) private credentialModel: Model<Credential>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly jwtService: JWTService,
    private readonly userService: UserService,
  ) {}

  async verifyPassword(email: string, passAtemp: string): Promise<boolean> {
    try {
      const credentials = await this.credentialModel
        .findOne<{ password: string }>({ email }, 'password -_id')
        .exec();
      if (!credentials) {
        throw new NotFoundException(`User with email ${email} not found.`);
      }
      return compare(passAtemp, credentials.password);
    } catch (err) {
      this.logger.error(`Could not validate password for email ${email}`);
      throw err;
    }
  }

  signIn(input: SignInInput): Observable<SessionData> {
    const { email, password } = input;
    return from(this.verifyPassword(email, password)).pipe(
      switchMap((isVerified) => {
        if (!isVerified) {
          throw new UnauthorizedException(`Wrong password or email`);
        }
        return this.userService.getUserByEmail(email);
      }),
      switchMap((user) => {
        if (!user) {
          throw new NotFoundException(`User with email ${email} not found.`);
        }
        return this.jwtService
          .generateToken({
            sub: user.email,
          })
          .then((token) => ({
            token,
            email: user.email,
            fullName: user.fullName,
          }));
      }),
      catchError((err) => {
        const errMsg = `The user or password is wrong`;
        return errorHandler(err, this.logger, errMsg);
      }),
    );
  }

  async storePassword(
    email: string,
    password: string,
    session: mongoose.mongo.ClientSession,
  ): Promise<void> {
    try {
      const salt = await genSalt();
      const hashedPass = await hash(password, salt);
      const credential = new this.credentialModel({
        email,
        salt,
        password: hashedPass,
      });
      await credential.save({ session });
      return;
    } catch (err) {
      this.logger.error(err);
      const errMsg = `Could not hash password for email ${email}.`;
      throw new Error(errMsg);
    }
  }

  async _signUp(input: SignUpInput): Promise<SessionData> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const { password, email, fullName } = input;
      const newUser = new this.userModel({
        email,
        fullName,
      });
      await newUser.save({ session });
      await this.storePassword(email, password, session);
      await session.commitTransaction();
      const token = await this.jwtService.generateToken({ sub: email });
      return {
        token,
        email,
        fullName,
      };
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  }

  signUp(input: SignUpInput): Observable<SessionData> {
    const { email } = input;
    return from(this._signUp(input)).pipe(
      catchError((err) => {
        const errMsg = `Failed to create user for email ${email}.`;
        return errorHandler(err, this.logger, errMsg);
      }),
    );
  }
}
