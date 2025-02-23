import { InputType, Int, Field } from '@nestjs/graphql';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ParticipantInput } from './participant.input';

@InputType()
export class CreateEventInput {
  //TODO: Remove when auth implemented
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  ownerId: number;

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  title: string;

  @IsArray()
  @ArrayNotEmpty()
  @Field(() => [ParticipantInput])
  guests: ParticipantInput[];
}
