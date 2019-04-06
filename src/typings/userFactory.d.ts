import requestType from './requestType';
import { Response, NextFunction } from 'express';
import userType from './userType';

export default interface IUserFactory {
	save?: (data: userType) => userType;
}
