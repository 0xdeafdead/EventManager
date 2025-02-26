import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { throwError } from 'rxjs';

export default function errorHandler(
  err: unknown,
  logger: Logger,
  customMessage: string,
) {
  if (err instanceof HttpException) {
    return throwError(() => err);
  }

  if (err instanceof mongoose.mongo.MongoError) {
    if (err.code === 11000) {
      err = new BadRequestException(`Duplicate key error:${err.cause}`);
    }
  }

  if (err instanceof Error) {
    err = new InternalServerErrorException(customMessage);
  }

  logger.error(err);
  return throwError(() => err);
}
