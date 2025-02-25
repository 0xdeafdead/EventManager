import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SessionData {
  @Field(() => String)
  token: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  fullName: string;
}
