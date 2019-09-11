import { ErrorRequestHandler } from 'express';

export interface IError extends Error {
    data?: string[];
    statusCode?: number;
    message: string;
}
