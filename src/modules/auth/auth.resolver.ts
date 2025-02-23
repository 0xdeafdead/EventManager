import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/signIn.input';
import { SignUpInput } from './dto/signUp.input';
import { Observable } from 'rxjs';

@Resolver(() => String)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  signIn(@Args('signInInput') signInInput: SignInInput): Observable<String> {
    return this.authService.signIn(signInInput);
  }

  @Mutation(() => String)
  signUp(@Args('signUpInput') signUpInput: SignUpInput): Observable<String> {
    return this.authService.signUp(signUpInput);
  }
}
