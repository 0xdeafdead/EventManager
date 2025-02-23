import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema, Event } from '../../types';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  providers: [EventResolver, EventService],
})
export class EventModule {}
