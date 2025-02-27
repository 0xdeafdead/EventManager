import { Observable } from 'rxjs';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { AuthRequestPayload, Participant } from '../../types';
import { EventService } from './event.service';
import { Event } from '../../types/eventModel/event.model';
import { CreateEventInput } from './dto/createEvent.input';
import { GetOneEventInput } from './dto/getOneEvent.input';
import { RespondToEventInput } from './dto/respondToEvent.input';
import { UseGuards } from '@nestjs/common';
import { JWTGuard } from 'src/guards/JWTGuard.guard';
import { CurrentUser } from 'src/decorators/CurrentUser.decorator';

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => Event)
  getOneEvent(@Args() getOneEventInput: GetOneEventInput): Observable<Event> {
    return this.eventService.findOne(getOneEventInput.id);
  }

  @Query(() => [Event])
  @UseGuards(JWTGuard)
  getAllRelatedEvents(
    @CurrentUser() currenUser: AuthRequestPayload,
  ): Observable<Event[]> {
    return this.eventService.findAllRelatedEvents(currenUser.sub);
  }

  @Mutation(() => Event)
  @UseGuards(JWTGuard)
  createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
    @CurrentUser() currenUser: AuthRequestPayload,
  ): Observable<Event> {
    return this.eventService.create(createEventInput, currenUser.sub);
  }

  @Mutation(() => Event)
  @UseGuards(JWTGuard)
  freezeEvent(
    @Args('id', { description: 'Event id' }) id: string,
    @CurrentUser() currenUser: AuthRequestPayload,
  ): Observable<Event> {
    return this.eventService.freezeEvent(id, currenUser.sub);
  }

  @Mutation(() => Participant)
  @UseGuards(JWTGuard)
  respondToEvent(
    @Args('respondToEventInput') respondToEventInput: RespondToEventInput,
    @CurrentUser() currenUser: AuthRequestPayload,
  ): Observable<Participant> {
    return this.eventService.respondToEvent(
      respondToEventInput,
      currenUser.sub,
    );
  }
}
