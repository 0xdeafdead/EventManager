import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsMongoId } from 'class-validator';
import { ResponseType } from '../../../types';

@InputType()
export class RespondToEventInput {
  @IsMongoId()
  @Field(() => String)
  eventId: string;

  @IsEnum(ResponseType)
  @Field(() => ResponseType)
  response: ResponseType;
}
