import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CredentialDocument = HydratedDocument<Credential>;

@ObjectType()
@Schema()
export class Credential {
  @Field(() => String)
  _id: mongoose.Types.ObjectId;

  @Field(() => String)
  @Prop({
    required: true,
    unique: true,
    type: mongoose.Schema.Types.String,
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

export const CredentialSchema = SchemaFactory.createForClass(Credential);
