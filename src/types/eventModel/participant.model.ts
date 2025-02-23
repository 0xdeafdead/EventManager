import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum ResponseType {
  YES = 'YES',
  NO = 'NO',
  MAYBE = 'MAYBE',
}

registerEnumType(ResponseType, { name: 'ResponseType' });

@ObjectType()
@Schema()
export class Participant {
  @Field(() => String)
  @Prop({ required: true })
  fullName: string;

  @Field(() => String)
  @Prop({ required: true })
  email: string;

  @Field(() => ResponseType, { defaultValue: ResponseType.NO })
  @Prop({ type: String, required: true, default: ResponseType.NO })
  response: ResponseType;

  @Field(() => Number)
  @Prop({ required: true })
  updatedAt: number;
}

export type ParticipantDocument = HydratedDocument<Participant>;

export const ParticipantSchema = SchemaFactory.createForClass(Participant);
