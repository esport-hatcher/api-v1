// tslint:disable-next-line: no-import-side-effect
import 'module-alias/register';
import app from '@app';
import sequelize from '@db';
import User from '@models/User';

const executeMigration = async () => {
    const user = await User.findOne({
        where: { email: 'admin@esport-hatcher.com' },
    });
    if (!user) {
        const { BO_ADMIN_PWD } = process.env;
        await User.create({
            username: 'admin',
            password: BO_ADMIN_PWD,
            email: 'admin@esport-hatcher.com',
            superAdmin: true,
        });
    }
};

sequelize(false)
    .then(() => {
        app.listen(process.env.PORT_API, () => {
            executeMigration()
                // tslint:disable-next-line: no-console
                .then(() => console.log('seeded'))
                // tslint:disable-next-line: no-console
                .catch(() => console.log('failed to seed'));
            // tslint:disable-next-line: no-console
            console.log(`Executing server in ${process.env.NODE_ENV} mode`);
            // tslint:disable-next-line: no-console
            console.log(`Server listening on ${process.env.PORT_API}`);
        });
    })
    .catch((err: Error) => {
        // tslint:disable-next-line: no-console
        console.log(err);
    });
