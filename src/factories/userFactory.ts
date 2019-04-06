import IUserFactory from '../typings/userFactory';
import userType from '../typings/userType';
import User from '../models/User';

export default class userFactory implements IUserFactory {
	static async create(data: userType) {
		try {
			const user: userType = await User.findOne({
				where: { email: data.email }
			});
			if (user) {
				return null;
			}
			const newUser: userType = await User.create({
				email: data.email,
				username: data.username,
				avatarUrl: data.avatarUrl,
				password: data.password
			});
			return newUser;
		} catch (err) {
			return null;
		}
	}
}
