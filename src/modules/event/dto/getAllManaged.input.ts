import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@ArgsType()
export class GetAllManagedInput {
  @IsMongoId()
  @Field(() => String)
  userId: string;
}
