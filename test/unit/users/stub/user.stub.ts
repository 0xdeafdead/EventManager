import { Types } from 'mongoose';
import { User } from 'src/types';

const createdAt = new Date().getTime();
const updatedAt = new Date().getTime();
const date = new Date().getTime();

export const userStub = (): User => {
  return {
    _id: new Types.ObjectId('123456789012345678901234'),
    fullName: 'test',
    email: 'test',
    events: [
      {
        _id: new Types.ObjectId('123456789012345678901234'),
        title: 'test',
        date,
        participants: [],
        createdAt,
        updatedAt,
        ownerEmail: 'test',
        isActive: true,
      },
      {
        _id: new Types.ObjectId('123456789012345678901234'),
        title: 'test',
        date,
        participants: [],
        createdAt,
        updatedAt,
        ownerEmail: 'test',
        isActive: true,
      },
    ],
  };
};
