import { Response, NextFunction } from 'express';
import { omit } from 'lodash';
import { IRequest } from '@typings';
import { logRequest, unprocessableEntity } from '@utils';
import { Event } from '@models';
import { ModelController } from '@controllers';
import { FORBIDDEN_FIELDS, RECORDS_PER_PAGE } from '@config';

class EventController extends ModelController<typeof Event> {
    constructor() {
        super(Event);
    }

    @logRequest
    async create(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { team, user, owner } = req;
            const { title, description, place, dateBegin, dateEnd } = req.body;
            let newEvent: Event;

            if (team) {
                newEvent = await team.createEvent({
                    title,
                    description,
                    place,
                    dateBegin,
                    dateEnd,
                });
                await owner.addEvent(newEvent);
            } else {
                newEvent = await Event.create({
                    title,
                    description,
                    place,
                    dateBegin,
                    dateEnd,
                });
                await user.addEvent(newEvent);
            }
            return res.status(201).json(newEvent);
        } catch (err) {
            return next(err);
        }
    }

    async findAll(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { team, page, filters, dateFiltersQuery } = req;

        try {
            const records = await Event.findAll({
                limit: RECORDS_PER_PAGE,
                offset: (page - 1) * RECORDS_PER_PAGE,
                where: { teamId: team.id, ...filters, ...dateFiltersQuery },
                raw: true,
            });
            return res
                .status(200)
                .json(records.map(record => omit(record, ...FORBIDDEN_FIELDS)));
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async findAllByUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { user, page, filters, dateFiltersQuery } = req;

        try {
            const events = await user.getEvents({
                limit: RECORDS_PER_PAGE,
                offset: (page - 1) * RECORDS_PER_PAGE,
                where: { ...filters, ...dateFiltersQuery },
            });
            return res.status(200).json(events);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async updateById(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { event } = req;
        try {
            event.title = req.body.title || event.title;
            event.description = req.body.description || event.description;
            event.place = req.body.place || event.place;
            event.dateBegin = req.body.dateBegin || event.dateBegin;
            event.dateEnd = req.body.dateEnd || event.dateEnd;
            await event.save();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async createEventUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { event, user } = req;
        try {
            await event.addUser(user);
            return res.sendStatus(201);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async getEventUsers(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { event } = req;
        try {
            const usersInEvent = await event.getUsers();
            return res.status(200).json(usersInEvent);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async getEventUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { event, user } = req;
        try {
            const userInEvent = (await event.getUsers()).find(
                _user => _user.id === user.id
            );
            if (!userInEvent) {
                return next(unprocessableEntity('User not in event'));
            }
            return res.status(200).json(userInEvent);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async updateEventUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { event, user } = req;

            const userInEvent = (await event.getUsers()).find(
                _user => _user.id === user.id
            );
            if (!userInEvent) {
                return next(unprocessableEntity('User not in event'));
            }
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async deleteEventUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { user, event } = req;

            const eventUsers = await event.getUsers();
            const eventUser = eventUsers.find(_user => _user.id === user.id);

            if (!eventUser) {
                return next(unprocessableEntity('User not in event'));
            }
            await eventUser.EventUser.destroy();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }
}

export const eventController = new EventController();
