import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { CredentialSchema, Credential } from '../../types';
import { JwtModule } from '@app/jwt';
import { envs } from 'src/config/envs';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.forRootAsync({
      secret: envs.jwtSecret,
      audience: [envs.audience],
      issuer: envs.issuer,
    }),
    MongooseModule.forFeature([
      { name: Credential.name, schema: CredentialSchema },
    ]),
    UserModule,
  ],
  providers: [AuthResolver, AuthService],
})
export class AuthModule {}
