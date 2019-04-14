import requestType from '../general/requestType';
import { Response, NextFunction } from 'express';
import userType from './userType';

export default interface IUserFactory {
	create?: (data: userType) => Promise<userType>;
}
