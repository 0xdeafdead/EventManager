import { Observable } from 'rxjs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { SignInInput } from './dto/signIn.input';
import { SignUpInput } from './dto/signUp.input';
import { SessionData } from '../../types';

@Resolver(() => SessionData)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SessionData)
  signIn(
    @Args('signInInput') signInInput: SignInInput,
  ): Observable<SessionData> {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => SessionData)
  signUp(
    @Args('signUpInput') signUpInput: SignUpInput,
  ): Observable<SessionData> {
    return this.authService.signUp(signUpInput);
  }
}
