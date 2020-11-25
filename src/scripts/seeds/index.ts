import { sequelizeDb, seedData } from '@db';
import { logger } from '@utils';
import { argv } from 'yargs';
// tslint:disable: no-console

interface ISeedersArgs {
    instances?: number;
    force?: boolean;
}
export const Seed = () => {
    const args = argv as ISeedersArgs;
    const force = Boolean(args.force) || false;
    const instances = Number(args.instances) || 50;

    // tslint:disable-next-line: no-floating-promises
    sequelizeDb
        .init(force)
        .then(async () => {
            logger('Seeder', `Seeding ${instances} instances`);
            force && logger('Seeder', 'Database reseted');
            await seedData(instances);
            logger('Seeder', 'Seeding went successfully');
            process.exit(0);
        })
        .catch(() => {
            logger('Seeder', `Seeding went successfully`);
        });
};

Seed();
