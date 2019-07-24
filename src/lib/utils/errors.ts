import IError from '@typings/general/IError';

export const unauthorizedError = (msg: string = 'Unauthorized') => {
    const error: IError = new Error(msg);
    error.statusCode = 401;
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

// tslint:disable-next-line: no-any
export const validationError = (errors: any, msg?: string) => {
    const error: IError = new Error(msg || 'Validation failed');
    error.statusCode = 422;
    error.data = errors.array();
    return error;
};
