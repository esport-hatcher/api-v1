import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest } from '@utils';
import { Action } from '@models';
import { ModelController } from '@controllers';
import { teamController } from '../TeamsController';

class ActionController extends ModelController<typeof Action> {
    constructor() {
        super(Action);
    }

    @logRequest
    async create(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { team } = req;
            const { action } = req.body;

            const newAction = await team.createAction({
                action: action,
            });

            return res.status(201).json(newAction);
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
        const { action } = req;
        try {
            action.action = req.body.action;
            await action.save();
            return res.sendStatus(200);
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

        try {
            const actions = await team.getActions();
            let primary_actions = await Action.findAll({
                where: { TeamId: team.id },
            });

            primary_actions = primary_actions.concat(actions);
            return res.status(200).json(primary_actions);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async delete(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { action } = req;

        try {
            await action.destroy();
            return res.sendStatus(204);
        } catch (err) {
            return next(err);
        }
    }
}

export const actionController = new ActionController();
