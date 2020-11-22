// tslint:disable-file: no-console
import { IRequest } from '@typings';
import { Response } from 'superagent';
import { NextFunction } from 'express-serve-static-core';
import { bgYellow, fgBlack } from './colors-console';
import { pick } from 'lodash';

// tslint:disable-next-line: only-arrow-functions
export function logRequest(
    // tslint:disable-next-line: no-any
    _target: any,
    key: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
        req: IRequest,
        res: Response,
        next: NextFunction
    ) {
        // tslint:disable-next-line: no-invalid-this
        const response = await originalMethod.apply(this, [req, res, next]);
        if (process.env.NODE_ENV !== 'CI' && process.env.NODE_ENV !== 'test') {
            // tslint:disable-next-line: no-console
            console.log(
                bgYellow,
                fgBlack,
                `----------------------------CALLED ${key.toUpperCase()}----------------------------`
            );
            // tslint:disable-next-line: no-console
            console.log('NODE_ENV:', process.env.NODE_ENV);
            // tslint:disable-next-line: no-console
            console.log('Headers:', req.headers);
            if (req.owner) {
                // tslint:disable-next-line: no-console
                console.log(
                    'Authentified with token',
                    req.headers.authorization
                );
                // tslint:disable-next-line: no-console
                console.log(
                    'As user:',
                    pick(
                        req.owner.get({ plain: true }),
                        'id',
                        'username',
                        'email',
                        'superAdmin'
                    )
                );
            } else {
                // tslint:disable-next-line: no-console
                console.log('Not authentified');
            }
            if (req.body) {
                // tslint:disable-next-line: no-console
                console.log('Body:', req.body);
            }
            if (req.params) {
                // tslint:disable-next-line: no-console
                console.log('Params:', req.params);
            }
            if (response) {
                if (response.statusCode) {
                    // tslint:disable-next-line: no-console
                    console.log('Status Code:', response.statusCode);
                }
                if (response._header) {
                    // tslint:disable-next-line: no-console
                    console.log('Headers Res:', response._header);
                }
            }
            // tslint:disable-next-line: no-console
            console.log(
                bgYellow,
                fgBlack,
                `-----------------------------------END---------------------------------`
            );
        }
    };

    return descriptor;
}
