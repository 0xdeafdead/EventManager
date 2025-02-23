import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, from, Observable } from 'rxjs';

import { User } from '../../types/userModel/user.model';
import errorHandler from '../../utils/errrorHandler';
import { CreateUserInput } from './dto/createUser.input';

@Injectable()
export class UserService {
  logger = new Logger('UserService');
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  create(createUserInput: CreateUserInput): Observable<User> {
    const { email, fullName } = createUserInput;
    const user = new this.userModel({
      email,
      fullName,
    });
    return from(user.save()).pipe(
      catchError((error) => {
        return errorHandler(error, this.logger, 'Error creating user');
      }),
    );
  }

  getAllUsers() {
    return from(this.userModel.find()).pipe(
      catchError((error) => {
        return errorHandler(error, this.logger, 'Error fetching users');
      }),
    );
  }

  getUserByEmail(email: string) {
    return from(this.userModel.findOne({ email })).pipe(
      catchError((error) => {
        return errorHandler(error, this.logger, 'Error fetching user');
      }),
    );
  }
}
