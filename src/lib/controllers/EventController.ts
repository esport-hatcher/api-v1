import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest } from '@utils';
import { Event } from '@models';
import { ModelController } from '@controllers';

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
    async updateById(req: IRequest, res: Response, next: NextFunction) {
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
