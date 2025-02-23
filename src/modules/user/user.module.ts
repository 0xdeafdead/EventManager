import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../types/userModel/user.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [UserResolver, UserService],
  exports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UserService,
  ],
})
export class UserModule {}
