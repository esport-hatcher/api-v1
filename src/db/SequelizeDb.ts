import { Sequelize } from 'sequelize';
import { logger } from '@utils';
import { sqlDb, sqlHost, sqlPassword, sqlPort, sqlUser } from '@config';
import {
    User,
    initUser,
    Team,
    initTeam,
    Event,
    initEvent,
    TeamUser,
    initTeamUser,
    Task,
    initTask,
    TaskUser,
    initTaskUser,
} from '@models';

class SequelizeDb {
    private db: Sequelize;
    private dbTest: Sequelize;

    constructor() {
        this.db = null;
        this.dbTest = null;
    }

    private createInstance(db: string) {
        const { NODE_ENV, SEQUELIZE_LOGS } = process.env;
        return new Sequelize(db, sqlUser, sqlPassword, {
            dialect: 'mysql',
            host: sqlHost,
            port: sqlPort,
            logging:
                SEQUELIZE_LOGS === 'false'
                    ? // tslint:disable-next-line: no-console
                      false
                    : NODE_ENV === 'production' || NODE_ENV === 'CI'
                    ? false
                    : // tslint:disable-next-line: no-console
                      console.log,
        });
    }

    private getDb(test: boolean = false) {
        if (!this.db && !test) {
            logger('Database', 'Creating standard instance...');
            this.db = this.createInstance(sqlDb);
        }
        if (!this.dbTest && test) {
            logger('Database', 'Creating test instance...');
            this.dbTest = this.createInstance('eh_testing');
        }
        return test ? this.dbTest : this.db;
    }

    private async connect(test: boolean = false) {
        return test ? this.dbTest.authenticate() : this.db.authenticate();
    }

    private async sync(force: boolean = false, test: boolean = false) {
        return test ? this.dbTest.sync({ force }) : this.db.sync({ force });
    }

    /**
     * @param db : Sequelize ;
     * Register the models into the sequelize instance
     */
    private registerModels(db: Sequelize) {
        logger('Database', 'Initializing models');
        initUser(db);
        initTeam(db);
        initEvent(db);
        initTeamUser(db);
        initTask(db);
        initTaskUser(db);
    }

    /**
     * Define sequelize relations
     */
    private registerRelations() {
        /**
         * User can have many teams
         * Teams can have many users
         */
        logger('Database', 'Initializing relations');
        User.belongsToMany(Team, { through: TeamUser });
        Team.belongsToMany(User, { through: TeamUser });
        Event.belongsTo(Team, {
            constraints: true,
            onDelete: 'cascade',
        });
        Team.hasMany(Event);
        Task.belongsToMany(User, { through: TaskUser });
        User.belongsToMany(Task, { through: TaskUser });
    }

    public async close(test: ConstrainBoolean = false) {
        return test ? this.dbTest.close() : this.db.close();
    }

    /**
     * @param force : Do you want to reset the database on each instance
     * @param test : Is it test mode (eh_testing or eh)
     * Main function to initialize the database
     */
    public async init(force: boolean = false, test: boolean = false) {
        logger(
            'Database',
            `Launching database initialization (force: ${force}, test: ${test})`
        );
        if (!test && this.dbTest) {
            await this.dbTest.close();
        }
        if (test && this.db) {
            await this.db.close();
        }
        const db = this.getDb(test);
        this.registerModels(db);
        this.registerRelations();
        await this.connect(test);
        logger('Database', 'Syncing database...');
        await this.sync(force, test);
        logger('Database', 'Initialization ok');
    }
}

export const sequelizeDb = new SequelizeDb();
