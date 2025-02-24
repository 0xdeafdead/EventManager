import { createParamDecorator, SetMetadata } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthRequestPayload } from '../types';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContextHost): AuthRequestPayload => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request.user;
  },
);
