import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ParticipantInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  fullName: string;

  @IsEmail()
  @Field(() => String)
  email: string;
}
