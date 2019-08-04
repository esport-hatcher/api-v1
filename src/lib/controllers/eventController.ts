import { Response, NextFunction } from 'express';
import IRequest from '@typings/general/IRequest';
import { logRequest } from '@utils/decorators';
import Event from '@models/Event';

class EventController {
    @logRequest
    async createEvent(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { team } = req;
            const { title, description, place, from, to } = req.body;

            const newEvent = await Event.create({
                title,
                description,
                place,
                from,
                to,
            });
            await newEvent.addTeam(team, {
                through: {
                    teamStatus: true,
                    eventStatus: true,
                },
            });
            return res.status(201).json(newEvent);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async findAll(
        // tslint:disable-next-line: variable-name
        req: IRequest,
        res: Response,
        next: NextFunction
    ) {
        let events;
        try {
            if (req.query.page) {
                const { page } = req.query || 1;
                const perPage = 15;
                events = await Event.findAll({
                    limit: perPage,
                    offset: (page - 1) * perPage,
                });
            } else {
                events = await Event.findAll();
            }
            return res.status(200).json(events);
        } catch (err) {
            return next(err);
        }
    }
}

export default new EventController();
