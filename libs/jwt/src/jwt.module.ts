import { DynamicModule, Global, Module } from '@nestjs/common';
import { JWTService } from './jwt.service';
import { JWTModuleConfig } from './jwt.types';
import { JWT_MODULE_CONFIG } from './jwt.constants';

@Module({})
@Global()
export class JwtModule {
  public static forRootAsync(options: JWTModuleConfig): DynamicModule {
    return {
      module: JwtModule,
      providers: [
        {
          provide: JWT_MODULE_CONFIG,
          useValue: options,
        },
        JWTService,
      ],
      exports: [JWTService],
    };
  }
}
