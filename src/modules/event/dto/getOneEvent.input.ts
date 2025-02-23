import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';

@ArgsType()
export class GetOneEventInput {
  @IsMongoId()
  @Field(() => String)
  id: string;
}
