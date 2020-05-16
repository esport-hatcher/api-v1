import { Response, NextFunction } from 'express';
import { IRequest } from '@typings';
import { retrieveActionFromPath, forbiddenError } from '@utils';
import { Action } from '@models';

export const handlePermissions = async (
    req: IRequest,
    _res: Response,
    next: NextFunction
) => {
    //const { owner, team } = req;
    const action: string = retrieveActionFromPath(req);

    const actionEntity: Action = await Action.findOne({
        where: {
            action: action,
        },
    });

    if (actionEntity && !actionEntity.primary) {
        return next();
        return next(forbiddenError());
    } else {
        return next();
    }

    return next();
};
