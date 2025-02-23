import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@ObjectType()
@Schema()
export class Credential {
  @Field(() => String)
  @Prop({
    required: true,
    unique: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  email: string;

  @Field(() => String)
  @Prop({ required: true })
  password: string;

  @Field(() => String)
  @Prop({ required: true })
  salt: string;
}
