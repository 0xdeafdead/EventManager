import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserModelMock } from '../../../test/unit/users/stub/user.mock';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../../types';
import { CreateUserInput } from './dto/createUser.input';
import { userStub } from '../../../test/unit/users/stub/user.stub';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let userModel: UserModelMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useClass: UserModelMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<UserModelMock>(getModelToken(User.name));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const input: CreateUserInput = {
      email: 'jL6lH@example.com',
      fullName: 'John Doe',
    };

    test('should create a user', (done) => {
      userModel.create = jest.fn().mockResolvedValue(userStub());
      service.create(input).subscribe({
        next: (value) => {
          expect(value).toMatchObject(userStub());
          expect(userModel.create).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });

    test('should return an InternalException', (done) => {
      userModel.create = jest.fn().mockRejectedValue(new Error('test'));
      service.create(input).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          expect(error.message).toBe('Error creating user');
          done();
        },
      });
    });
  });

  describe('getAllUsers', () => {
    test('should return an array of users', (done) => {
      userModel.find = jest.fn().mockResolvedValue([userStub()]);
      service.getAllUsers().subscribe({
        next: (value) => {
          expect(value).toMatchObject([userStub()]);
          expect(userModel.find).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });

    test('should return an InternalException', (done) => {
      userModel.find = jest.fn().mockRejectedValue(new Error('test'));
      service.getAllUsers().subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
  });

  describe('_findOne', () => {
    let email = 'jL6lH@example.com';

    test('should return a user', (done) => {
      userModel.findOne = jest
        .fn()
        .mockReturnValueOnce({ exec: () => Promise.resolve(userStub()) });
      service._findOne(email).subscribe({
        next: (value) => {
          expect(value).toMatchObject(userStub());
          expect(userModel.findOne).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });

    test('should return a NotFoundException', (done) => {
      userModel.findOne = jest
        .fn()
        .mockReturnValueOnce({ exec: () => Promise.resolve(undefined) });
      service._findOne(email).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    test('should return a NotFoundException', (done) => {
      userModel.findOne = jest
        .fn()
        .mockReturnValueOnce({ exec: () => Promise.resolve(undefined) });
      service._findOne(email).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    test('should return a IntenralServerException', (done) => {
      userModel.findOne = jest
        .fn()
        .mockReturnValueOnce({ exec: () => Promise.reject(new Error('test')) });
      service._findOne(email).subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(InternalServerErrorException);
          done();
        },
      });
    });
  });

  describe('getUserByEmail', () => {
    test('should return a user', (done) => {
      userModel.findOne = jest
        .fn()
        .mockReturnValueOnce({ exec: () => Promise.resolve(userStub()) });
      service.getUserByEmail('jL6lH@example.com').subscribe({
        next: (value) => {
          expect(value).toMatchObject(userStub());
          expect(userModel.findOne).toHaveBeenCalledTimes(1);
          done();
        },
      });
    });

    test('should return a NotFoundException', (done) => {
      userModel.findOne = jest
        .fn()
        .mockReturnValueOnce({ exec: () => Promise.resolve(undefined) });
      service.getUserByEmail('jL6lH@example.com').subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });
  });
});
