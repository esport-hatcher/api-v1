import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest } from '@utils';
import { Permission, Role, Action } from '@models';
import { ModelController } from '@controllers';

class PermissionController extends ModelController<typeof Permission> {
    constructor() {
        super(Permission);
    }

    @logRequest
    async create(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { team } = req;
            const { scope } = req.body;

            const newPermission = await team.createPermission({
                scope: scope,
            });

            return res.status(201).json(newPermission);
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
        const { permission } = req;
        try {
            permission.scope = req.body.scope;
            await permission.save();
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
            const permissions = await team.getPermissions({
                include: [Role, Action],
            });
            let primary_permissions = await Permission.findAll({
                where: { primary: true },
                include: [Role, Action],
            });

            primary_permissions = primary_permissions.concat(permissions);
            return res.status(200).json(primary_permissions);
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
        const { permission } = req;

        try {
            await permission.destroy();
            return res.sendStatus(204);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async addRole(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { permission } = req;

        try {
            const role = await Role.findOne({
                where: { id: req.body.roleId },
            });

            permission.addRole(role);
            res.sendStatus(200).json(permission);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async addAction(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { permission } = req;

        try {
            const action = await Action.findOne({
                where: { id: req.body.actionId },
            });

            permission.addAction(action);
            res.sendStatus(200).json(permission);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async removeRole(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { permission } = req;

        try {
            const role = await Role.findOne({
                where: { id: req.body.roleId },
            });

            permission.removeRole(role);
            res.sendStatus(200).json(permission);
        } catch (err) {
            return next(err);
        }
    }

    @logRequest
    async removeAction(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        const { permission } = req;

        try {
            const action = await Action.findOne({
                where: { id: req.body.actionId },
            });

            permission.removeAction(action);
            res.sendStatus(200).json(permission);
        } catch (err) {
            return next(err);
        }
    }
}

export const permissionController = new PermissionController();
