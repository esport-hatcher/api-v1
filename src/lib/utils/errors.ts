import { Result } from 'express-validator/check';
import { IError } from '@typings';

export const unauthorizedError = (msg: string = 'Unauthorized') => {
    const error: IError = new Error(msg);
    error.statusCode = 401;
    error.message = msg;
    return error;
};

export const forbiddenError = (msg: string = '403 Forbidden') => {
    const error: IError = new Error(msg);
    error.statusCode = 403;
    error.message = msg;

    return error;
};

export const notFoundError = (entity: string) => {
    const error: IError = new Error(`${entity} not found`);
    error.statusCode = 404;
    error.message = `${entity} not found`;
    return error;
};

export const conflictError = (msg?: string) => {
    const error: IError = new Error(msg || 'Conflict');
    error.statusCode = 409;
    error.message = msg || 'Conflict';
    return error;
};

export const unprocessableEntity = (errors: Result, msg?: string) => {
    const error: IError = new Error(msg || 'Unprocessable entity');
    error.statusCode = 422;
    error.data = errors.array();
    return error;
};
