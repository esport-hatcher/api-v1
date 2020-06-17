import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest, unprocessableEntity } from '@utils';
import { Task } from '@models';
import { ModelController } from '@controllers';
import { omit } from 'lodash';
import { FORBIDDEN_FIELDS, RECORDS_PER_PAGE } from '@config';

class TaskController extends ModelController<typeof Task> {
    constructor() {
        super(Task);
    }

    @logRequest
    async create(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { team } = req;
            const { title, description, dateBegin, dateEnd } = req.body;

            const newTask = await team.createTask({
                title,
                description,
                dateBegin,
                dateEnd,
            });
            return res.status(201).json(newTask.get({ plain: true }));
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
            const records = await Task.findAll({
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
        const { task } = req;
        try {
            task.title = req.body.title || task.title;
            task.description = req.body.description || task.description;
            task.dateBegin = req.body.dateBegin || task.dateBegin;
            task.dateEnd = req.body.dateEnd || task.dateEnd;
            task.completed = req.body.completed || task.completed;
            await task.save();
            return res.status(200).json(task.get({ plain: true }));
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async createTaskUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { task, user } = req;
        try {
            await task.addUser(user);
            return res.sendStatus(201);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async getTaskUsers(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { task } = req;
        try {
            const usersInTask = await task.getUsers();
            return res.status(200).json(usersInTask);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async getTaskUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { task, user } = req;
        try {
            const userInTask = (await task.getUsers()).find(
                _user => _user.id === user.id
            );
            if (!userInTask) {
                return next(unprocessableEntity('User not in task'));
            }
            return res.status(200).json(userInTask);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async updateTaskUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { task, user } = req;

            const userInTask = (await task.getUsers()).find(
                _user => _user.id === user.id
            );
            if (!userInTask) {
                return next(unprocessableEntity('User not in task'));
            }
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async deleteTaskUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { user, task } = req;

            const taskUsers = await task.getUsers();
            const taskUser = taskUsers.find(_user => _user.id === user.id);

            if (!taskUser) {
                return next(unprocessableEntity('User not in task'));
            }
            await taskUser.TaskUser.destroy();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }
}

export const taskController = new TaskController();
