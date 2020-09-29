import { sequelizeDb } from '@db';
// tslint:disable: no-console

export const Seed = () => {
    sequelizeDb
        .init(true)
        .then(() => {
            console.log('seeding successful');
            process.exit(0);
        })
        .catch(() => {
            console.log('seeding failed');
        });
};

Seed();
