import { BadRequestException, HttpException, Logger } from '@nestjs/common';
import mongoose, { Error } from 'mongoose';
import { throwError } from 'rxjs';

export default function errorHandler(
  err: unknown,
  logger: Logger,
  customMessage: string,
) {
  if (err instanceof mongoose.mongo.MongoError) {
    if (err.code === 11000) {
      console.log('error', err.stack);
      err = new BadRequestException(`Duplicate key error:${err.cause}`);
    }
  }

  if (err instanceof Error) {
    err = new HttpException({ message: customMessage }, 500);
  }
  logger.error(err);
  return throwError(() => err);
}
