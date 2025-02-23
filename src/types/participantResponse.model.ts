import { registerEnumType } from '@nestjs/graphql';

export enum ResponseType {
  NO,
  YES,
  MAYBE,
}

registerEnumType(ResponseType, { name: 'ResponseType' });
