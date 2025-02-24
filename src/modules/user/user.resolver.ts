import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../../types/userModel/user.model';
import { CurrentUser } from '../../decorators/CurrentUser.decorator';
import { AuthRequestPayload } from '../../types';
import { UseGuards } from '@nestjs/common';
import { JWTGuard } from 'src/guards/JWTGuard.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.userService.create(createUserInput);
  // }

  // @Query(() => [User])
  // getAllUsers() {
  //   return this.userService.getAllUsers();
  // }

  @Query(() => User)
  @UseGuards(JWTGuard)
  getUser(@CurrentUser() currenUser: AuthRequestPayload) {
    return this.userService.getUserByEmail(currenUser.sub);
  }
}
