import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { EventModule } from './modules/event/event.module';
import { AuthModule } from './modules/auth/auth.module';
import { envs } from './config/envs';

@Module({
  imports: [
    UserModule,
    EventModule,
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: envs.app_env == 'dev',
    }),
    MongooseModule.forRoot(envs.mongoAtlasUri, {
      autoCreate: true,
      dbName: 'event-manager',
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
