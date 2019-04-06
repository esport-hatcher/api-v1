import { Request } from 'express';
import userType from './userType';

export default interface requestType extends Request {
	user: userType;
}
