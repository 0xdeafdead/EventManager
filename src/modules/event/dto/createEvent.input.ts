import { InputType, Int, Field } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { ParticipantInput } from './participant.input';

@InputType()
export class CreateEventInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  title: string;

  @IsNumber()
  @Field(() => Number)
  date: number;

  @IsArray()
  @ArrayNotEmpty()
  @Field(() => [ParticipantInput])
  guests: ParticipantInput[];
}
