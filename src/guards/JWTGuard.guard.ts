import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JWTService } from '@app/jwt';
import { envs } from '../config/envs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JWTGuard implements CanActivate {
  constructor(@Inject(JWTService) private readonly jwtService: JWTService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('No authentication provided');
    }
    try {
      const payload = await this.jwtService.verifyToken(token, {
        algorithms: ['HS256'],
        issuer: [envs.issuer],
        audience: [envs.audience],
      });
      request['user'] = {
        sub: payload.sub,
      };
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new ForbiddenException('Invalid token');
      }
    }
  }
}
