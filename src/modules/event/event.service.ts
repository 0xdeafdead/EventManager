import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEventInput } from './dto/createEvent.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, Participant, ResponseType } from '../../types';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import errorHandler from 'src/utils/errrorHandler';
import { RespondToEventInput } from './dto/respondToEvent.input';
import { UserService } from '../user/user.service';

@Injectable()
export class EventService {
  logger = new Logger('EventService');
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    private readonly userService: UserService,
  ) {}

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

  create(
    createEventInput: CreateEventInput,
    currentUserEmail: string,
  ): Observable<Event> {
    const { guests, title, date } = createEventInput;
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
      date,
      ownerEmail: currentUserEmail,
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

  findOne(id: string): Observable<Event> {
    return this._findOne(id).pipe(
      catchError((error: Error) => {
        this.logger.error(error);
        return errorHandler(error, this.logger, 'Error fetching event');
      }),
    );
  }

  findAllRelatedEvents(currentUserEmail: string): Observable<Event[]> {
    return from(
      this.eventModel
        .find<Event>({
          $or: [
            { ownerEmail: currentUserEmail },
            { 'participants.email': currentUserEmail },
          ],
        })
        .exec(),
    ).pipe(
      catchError((error: Error) => {
        this.logger.error(error);
        return errorHandler(error, this.logger, 'Error fetching events');
      }),
    );
  }

  freezeEvent(id: string, currentUserEmail: string): Observable<Event> {
    return this._findOne(id).pipe(
      switchMap((event) => {
        if (event.ownerEmail !== currentUserEmail) {
          throw new UnauthorizedException(
            'You are not the owner of this event',
          );
        }

        event.set({ isActive: !event.isActive, updatedAt: Date.now() });
        return from(event.save());
      }),
      catchError((error: Error) => {
        this.logger.error(error);
        return errorHandler(error, this.logger, 'Error holding event');
      }),
    );
  }

  respondToEvent(
    input: RespondToEventInput,
    currentUserEmail: string,
  ): Observable<Participant> {
    const { eventId, response } = input;
    return this._findOne(eventId).pipe(
      switchMap((event) => {
        if (!event.isActive) {
          throw new BadRequestException('Event is on hold');
        }
        const participant = event.participants.find(
          (participant) => participant.email === currentUserEmail,
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
