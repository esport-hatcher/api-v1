import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { logRequest } from '@utils';
import { Organization } from '@models';
import { ModelController } from '@controllers';

class OrganizationController extends ModelController<typeof Organization> {
    constructor() {
        super(Organization);
    }

    @logRequest
    async create(
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void | Response> {
        try {
            const { name } = req.body;

            const newOrganization = await Organization.create({
                name,
            });
            return res.status(201).json(newOrganization);
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
        const { organization } = req;

        try {
            organization.name = req.body.name || organization.name;
            organization.avatarOrganizationUrl =
                req.body.avatarOrganizationUrl ||
                organization.avatarOrganizationUrl;
            organization.bannerUrl =
                req.body.bannerUrl || organization.bannerUrl;
            await organization.save();
            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }
}

export const organizationController = new OrganizationController();
