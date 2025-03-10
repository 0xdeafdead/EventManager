import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class GetUserByEmailInput {
  @IsEmail()
  @Field(() => String)
  email: string;
}
