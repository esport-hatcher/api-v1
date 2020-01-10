import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest, unauthorizedError } from '@utils';
import { Task } from '@models';
import { ModelController } from '@controllers';
import { FORBIDDEN_FIELDS } from '@config';

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
            const { owner } = req;
            const {
                title,
                description,
                deadline,
                dateBegin,
                dateEnd,
            } = req.body;

            const newTask = await Task.create({
                title,
                description,
                deadline,
                dateBegin,
                dateEnd,
            });
            await newTask.addUser(owner);
            return res.status(201).json(newTask);
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
            const taskUsers = await task.getUsers();
            /**
             * Check if the invited user has already request to join the task
             */
            const userInTask = taskUsers.find(
                userRequest => userRequest.id === user.id
            );
            /**
             * If the userInTask has already request to join the task accept him
             */
            if (userInTask) {
                return res.sendStatus(201);
            }
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
            task.deadline = req.body.deadline || task.deadline;
            task.dateBegin = req.body.dateBegin || task.dateBegin;
            task.dateEnd = req.body.dateEnd || task.dateEnd;
            await task.save();
            return res.sendStatus(200);
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
}

export const taskController = new TaskController();
