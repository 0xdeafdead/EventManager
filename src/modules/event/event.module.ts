import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, Event } from '../../types';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    UserModule,
  ],
  providers: [EventResolver, EventService],
})
export class EventModule {}
