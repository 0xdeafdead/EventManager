import { Field, ObjectType } from '@nestjs/graphql';
import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Event } from './event.model';

export type UserDocument = HydratedDocument<User>;

@ObjectType()
@Schema()
export class User {
  @Field(() => String)
  _id: mongoose.Types.ObjectId;

  @Field(() => String)
  @Prop({ required: true })
  fullName: string;

  @Field(() => String)
  @Prop({ required: true, unique: true })
  email: string;

  @Field(() => [Event], { defaultValue: [] })
  @Prop({ required: true, type: [Event], default: [] })
  events: Event[];
}

export const UserSchema = SchemaFactory.createForClass(User);
