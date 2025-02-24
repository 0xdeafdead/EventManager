import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Participant } from './participant.model';
import { Field, ObjectType } from '@nestjs/graphql';

export type EventDocument = HydratedDocument<Event>;

@ObjectType()
@Schema()
export class Event {
  @Field(() => String)
  _id: mongoose.Types.ObjectId;

  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Field(() => [Participant], { defaultValue: [] })
  @Prop({ type: [Participant], required: true, default: [] })
  participants: Participant[];

  @Field(() => Number)
  @Prop({ required: true })
  createdAt: number;

  @Field(() => Number)
  @Prop({ required: true })
  updatedAt: number;

  @Field(() => String)
  @Prop({ required: true, type: mongoose.Schema.Types.String, ref: 'User' })
  ownerEmail: string;

  @Field(() => Boolean)
  @Prop({ required: true })
  isActive: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
