import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { catchError, from, Observable } from 'rxjs';

import { User } from '../../types/userModel/user.model';
import errorHandler from '../../utils/errrorHandler';
import { UpdateUserInput } from './dto/update-user.input';
import { CreateUserInput } from './dto/create-user.input';

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

  getUser(id: string) {
    return from(this.userModel.findById(id)).pipe(
      catchError((error) => {
        return errorHandler(error, this.logger, 'Error fetching user');
      }),
    );
  }
}
