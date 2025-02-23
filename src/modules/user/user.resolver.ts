import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from '../../types/userModel/user.model';
import { CreateUserInput } from './dto/createUser.input';
import { GetUserByEmailInput } from './dto/getUserByEmail.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  @Query(() => [User])
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Query(() => User)
  getUser(
    @Args('getUserByEmailInput') getUserByEmailInput: GetUserByEmailInput,
  ) {
    return this.userService.getUserByEmail(getUserByEmailInput.email);
  }
}
