import { Observable } from 'rxjs';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';

import { UserService } from './user.service';
import { AuthRequestPayload } from '../../types';
import { JWTGuard } from '../../guards/JWTGuard.guard';
import { User } from '../../types/userModel/user.model';
import { CurrentUser } from '../../decorators/CurrentUser.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(JWTGuard)
  getUser(@CurrentUser() currenUser: AuthRequestPayload): Observable<User> {
    return this.userService.getUserByEmail(currenUser.sub);
  }
}
