import { Response, NextFunction } from 'express';
import IRequest from '@typings/general/IRequest';
import { logRequest } from '@utils/decorators';
import Event from '@models/Event';
import Team from '@models/Team';
import { unauthorizedError, notFoundError } from '@utils/errors';

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
                    role: 'Owner',
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
    async addEventTeam(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { team } = req;
            const { teamId, eventId } = req.params;

            const event = await Event.findByPk(eventId);
            if (!event) {
                return next(notFoundError('Event'));
            }
            const invitedTeam = await Team.findByPk(teamId);
            if (!invitedTeam) {
                return next(notFoundError('Invited team'));
            }
            const teams = await event.getTeams();
            const eventTeam = teams.find(eventTeam => eventTeam.id === team.id);
            if (
                !eventTeam ||
                (eventTeam.EventTeam.role !== 'Owner' &&
                    eventTeam.EventTeam.role !== 'Admin')
            ) {
                return next(unauthorizedError());
            }
            event.addTeam(invitedTeam, {
                through: {
                    role: req.body.role,
                    eventStatus: true,
                    teamStatus: false,
                },
            });
            return res.sendStatus(201);
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

    @logRequest
    async findById(req: IRequest, res: Response, next: NextFunction) {
        const { eventId } = req.params;

        try {
            const event = await Event.findByPk(eventId);

            if (!event) {
                return next(notFoundError('Event'));
            }
            return res.status(200).json(event);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async deleteById(req: IRequest, res: Response, next: NextFunction) {
        const { eventId } = req.params;

        try {
            const event = await Event.findByPk(eventId);
            if (!event) {
                return next(notFoundError('Event'));
            }
            await event.destroy();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async updateById(req: IRequest, res: Response, next: NextFunction) {
        const { eventId } = req.params;
        try {
            const event = await Event.findByPk(eventId);
            if (!event) {
                return next(notFoundError('Event'));
            }
            event.title = req.body.title || event.title;
            event.description = req.body.description || event.description;
            event.place = req.body.place || event.place;
            event.from = req.body.from || event.from;
            event.to = req.body.to || event.to;
            await event.save();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }
}

export default new EventController();
