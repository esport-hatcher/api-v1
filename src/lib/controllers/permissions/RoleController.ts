import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest } from '@utils';
import { Role } from '@models';
import { ModelController } from '@controllers';

class RoleController extends ModelController<typeof Role> {
    constructor() {
        super(Role);
    }

    @logRequest
    async create(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { team } = req;
            const { name } = req.body;

            const newRole = await team.createRole({
                name,
            });

            return res.status(201).json(newRole);
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
        const { role } = req;
        try {
            role.name = req.body.name;
            await role.save();
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
            const roles = team.getRoles();
            const primary_roles = await Role.findAll({
                where: { primary: true },
            });

            (await roles).concat(primary_roles);
            return res.status(200).json(roles);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async findDefault(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const {} = req;

        try {
            const primary_roles = await Role.findAll({
                where: { primary: true },
            });

            return res.status(200).json(primary_roles);
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
        try {
            const { role } = req;

            role.destroy();
            return res.sendStatus(204);
        } catch (err) {
            return next(err);
        }
    }
}

export const roleController = new RoleController();
