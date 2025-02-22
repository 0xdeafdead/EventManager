import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ParticipantDocument = HydratedDocument<Participant>;

@ObjectType()
@Schema()
export class Participant {
  @Field(() => String)
  @Prop({ required: true })
  fullName: string;

  @Field(() => String)
  @Prop({ required: true, unique: true })
  email: string;

  @Field(() => Boolean, { defaultValue: false })
  @Prop({ required: true, default: false })
  confirmation: boolean;

  @Field(() => Date)
  @Prop({ required: true })
  updatedAt: Date;
}

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
