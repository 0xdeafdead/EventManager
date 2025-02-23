import { Observable } from 'rxjs';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { Participant } from '../../types';
import { EventService } from './event.service';
import { Event } from '../../types/event.model';
import { CreateEventInput } from './dto/createEvent.input';
import { GetOneEventInput } from './dto/getOneEvent.input';
import { GetAllManagedInput } from './dto/getAllManaged.input';
import { GetAllInvitedInput } from './dto/getAllInvited.input';
import { RespondToEventInput } from './dto/respondToEvent.input';

@Resolver(() => Event)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => Event)
  getOneEvent(@Args() getOneEventInput: GetOneEventInput): Observable<Event> {
    return this.eventService.findOne(getOneEventInput.id);
  }

  @Query(() => [Event])
  getAllManagedByUser(
    @Args() getAllManagedByUser: GetAllManagedInput,
  ): Observable<Event[]> {
    return this.eventService.findAllManagerByUser(getAllManagedByUser.userId);
  }

  @Query(() => [Event])
  getAllInvitedByUser(
    @Args() getAllInvitedInput: GetAllInvitedInput,
  ): Observable<Event[]> {
    return this.eventService.findAllInvitedByUser(getAllInvitedInput.email);
  }

  @Mutation(() => Event)
  createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
  ): Observable<Event> {
    return this.eventService.create(createEventInput);
  }

  @Mutation(() => Event)
  freezeEvent(@Args('id', { description: 'Event id' }) id: string) {
    return this.eventService.freezeEvent(id);
  }

  @Mutation(() => Participant)
  respondToEvent(
    @Args('respondToEventInput') respondToEventInput: RespondToEventInput,
  ): Observable<Participant> {
    return this.eventService.respondToEvent(respondToEventInput);
  }
}
