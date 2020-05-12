import { NextFunction, Response } from 'express';
import { IRequest } from '@typings';
import { unprocessableEntity, uploader } from '@utils';

class BaseController {
    async upload(req: IRequest, res: Response, next: NextFunction) {
        try {
            const { owner } = req;
            const { type, key } = req.query;

            if (!type || !key || !type) {
                return next(unprocessableEntity());
            }
            const url = await uploader({
                folder: owner.id.toString(),
                key: String(key),
                type: String(type),
            });
            return res.json({ url });
        } catch (err) {
            return next(err);
        }
    }
}

export const baseContoller = new BaseController();
