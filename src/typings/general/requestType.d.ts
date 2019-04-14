import { Request } from 'express';
import userType from '../user/userType';

export default interface requestType extends Request {
	user: userType;
}
