import { ArgsType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@ArgsType()
export class GetAllInvitedInput {
  @IsEmail()
  @Field(() => String)
  email: string;
}
