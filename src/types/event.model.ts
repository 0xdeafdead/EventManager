import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Participant } from './participant.model';
import { Field, ObjectType } from '@nestjs/graphql';

export type EventDocument = HydratedDocument<Event>;

@ObjectType()
@Schema()
export class Event {
  @Field(() => String)
  @Prop({ required: true, unique: true })
  id: string;

  @Field(() => String)
  @Prop({ required: true })
  title: string;

  @Field(() => [Participant], { defaultValue: [] })
  @Prop({ type: [Participant], required: true, default: [] })
  participants: Participant[];

  @Field(() => Date)
  @Prop({ required: true })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ required: true })
  updatedAt: Date;

  @Field(() => String)
  @Prop({ required: true, type: mongoose.Schema.Types.String, ref: 'User' })
  owner: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
