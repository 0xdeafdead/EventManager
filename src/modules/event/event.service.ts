import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventInput } from './dto/createEvent.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query } from 'mongoose';
import { Event, EventDocument, Participant, ResponseType } from '../../types';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import errorHandler from 'src/utils/errrorHandler';
import { RespondToEventInput } from './dto/respondToEvent.input';

@Injectable()
export class EventService {
  logger = new Logger('EventService');
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  create(createEventInput: CreateEventInput): Observable<Event> {
    const { ownerId, guests, title } = createEventInput;
    const now = Date.now();
    const participants: Participant[] = guests.map(({ fullName, email }) => ({
      fullName,
      email,
      response: ResponseType.NO,
      updatedAt: now,
    }));
    const event = new this.eventModel({
      title,
      participants,
      owner: ownerId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });
    return from(event.save()).pipe(
      catchError((error: Error) => {
        this.logger.error(error);
        return errorHandler(error, this.logger, 'Error creating event');
      }),
    );
  }

  // findAll() {
  //   return `This action returns all event`;
  // }
  private _findOne(id: string) {
    return from(this.eventModel.findById(id)).pipe(
      switchMap((event) => {
        if (!event) {
          throw new NotFoundException('Event not found');
        }
        return of(event);
      }),
      catchError((error: Error) => {
        this.logger.error(error);
        return errorHandler(error, this.logger, 'Error fetching event');
      }),
    );
  }

  findOne(id: string): Observable<Event> {
    return this._findOne(id).pipe(
      catchError((error: Error) => {
        this.logger.error(error);
        return errorHandler(error, this.logger, 'Error fetching event');
      }),
    );
  }

  findAllManagerByUser(userId: string): Observable<Event[]> {
    return from(this.eventModel.find({ owner: userId }).exec()).pipe(
      catchError((error: Error) => {
        this.logger.error(error);
        return errorHandler(error, this.logger, 'Error fetching events');
      }),
    );
  }

  findAllInvitedByUser(email: string): Observable<Event[]> {
    return from(
      this.eventModel.find<Event>({ 'participants.email': email }).exec(),
    ).pipe(
      catchError((error: Error) => {
        this.logger.error(error);
        return errorHandler(error, this.logger, 'Error fetching events');
      }),
    );
  }

  freezeEvent(id: string): Observable<Event> {
    return this._findOne(id).pipe(
      switchMap((event) => {
        if (event.isActive) {
          event.set({ isActive: false });
          return from(event.save());
        } else {
          throw new BadRequestException('Event is already on hold');
        }
      }),
      catchError((error: Error) => {
        this.logger.error(error);
        return errorHandler(error, this.logger, 'Error holding event');
      }),
    );
  }

  respondToEvent(input: RespondToEventInput): Observable<Participant> {
    const { eventId, email, response } = input;
    return this._findOne(eventId).pipe(
      switchMap((event) => {
        if (!event.isActive) {
          throw new BadRequestException('Event is on hold');
        }
        const participant = event.participants.find(
          (participant) => participant.email === email,
        );
        if (!participant) {
          throw new NotFoundException(
            `Sorry. You're not invited to this event.`,
          );
        }
        participant.response = response;
        participant.updatedAt = Date.now();
        return from(event.save().then(() => participant));
      }),
      catchError((error: Error) => {
        this.logger.error(error);
        return errorHandler(error, this.logger, 'Failed to respond to event');
      }),
    );
  }
}
