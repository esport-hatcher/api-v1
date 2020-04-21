import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest, unauthorizedError } from '@utils';
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
            const { owner, team } = req;
            const {
                title,
                description,
                dueDate,
                dateBegin,
                dateEnd,
            } = req.body;

            const newTask = await team.createTask({
                title: title,
                description: description,
                dueDate: dueDate,
                dateBegin: dateBegin,
                dateEnd: dateEnd,
            });
            await newTask.addUser(owner);
            return res.status(201).json(newTask);
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
    async addTaskUser(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { user, task } = req;
            /**
             * Invite an user in the task
             */
            task.addUser(user);
            return res.sendStatus(201);
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
            /**
             * Check if the invited user has already request to join the task
             */
            const userInTask = taskUsers.find(
                userRequest => userRequest.id === user.id
            );
            /**
             * Check if the user is in the task he wants to quit
             */
            if (!userInTask) {
                return next(unauthorizedError("User isn't in that task"));
            }
            /**
             * Destroy an user in the task
             */
            await userInTask.TaskUser.destroy();
            return res.sendStatus(201);
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
            task.dueDate = req.body.dueDate || task.dueDate;
            task.dateBegin = req.body.dateBegin || task.dateBegin;
            task.dateEnd = req.body.deadline || task.dateEnd;
            await task.save();
            return res.sendStatus(200).json(task);
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
        try {
            const { task } = req;
            const taskUsers = await task.getUsers({
                attributes: { exclude: FORBIDDEN_FIELDS },
            });
            return res.status(200).json(taskUsers);
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
        const { task } = req;

        try {
            await task.destroy();
            return res.sendStatus(204);
        } catch (err) {
            return next(err);
        }
    }
}

export const taskController = new TaskController();
