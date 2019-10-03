import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest } from '@utils';
import { Event } from '@models';
import { ModelController } from '@controllers';
import { omit } from 'lodash';
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
            const { team } = req;
            const { title, description, place, dateBegin, dateEnd } = req.body;

            const newEvent = await team.createEvent({
                title,
                description,
                place,
                dateBegin,
                dateEnd,
            });
            return res.status(201).json(newEvent);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async findAll(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { team } = req;
        const page = req.pagination;
        const filters = req.filters;

        try {
            const records = await Event.findAll({
                limit: RECORDS_PER_PAGE,
                offset: (page - 1) * RECORDS_PER_PAGE,
                where: { teamId: team.id, ...filters },
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
}

export const eventController = new EventController();
