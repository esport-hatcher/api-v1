import { User } from '@models';
import { checkIfEmail, checkIfMinAndMax } from '@utils';
import { IUserProps } from '@typings';

class UserFactory {
    async create(data: IUserProps) {
        try {
            if (
                !checkIfEmail(data.email) ||
                !checkIfMinAndMax(data.password, { min: 5, max: 20 })
            ) {
                return Promise.reject({
                    statusCode: 422,
                    message: "Validation doesn't pass",
                });
            }
            const user = await User.findOne({
                where: { email: data.email },
            });
            if (user) {
                return Promise.reject({
                    statusCode: 409,
                    message: 'User already exist',
                });
            }
            const newUser = await User.create(data);
            return newUser;
        } catch (err) {
            throw new Error(err);
        }
    }
}

export const userFactory = new UserFactory();
