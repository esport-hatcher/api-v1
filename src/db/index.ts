import { sqlDb, sqlHost, sqlPassword, sqlPort, sqlUser } from '@config/keys';
import { Sequelize } from 'sequelize';

class SequelizeDb {
    private db: Sequelize;
    private dbTest: Sequelize;

    constructor() {
        this.db = null;
        this.dbTest = null;
    }

    createInstance(db: string) {
        const { NODE_ENV, SEQUELIZE_LOGS } = process.env;
        return new Sequelize(db, sqlUser, sqlPassword, {
            dialect: 'mysql',
            host: sqlHost,
            port: sqlPort,
            logging:
                NODE_ENV === 'prod' || NODE_ENV === 'CI'
                    ? false
                    : SEQUELIZE_LOGS === 'false'
                    ? false
                    : true,
        });
    }

    getDb(test: boolean = false) {
        if (!this.db && !test) {
            this.db = this.createInstance(sqlDb);
        }
        if (!this.dbTest && test) {
            this.dbTest = this.createInstance('eh_test');
        }
        return test ? this.dbTest : this.db;
    }

    async connect(test: boolean = false) {
        return test ? this.dbTest.authenticate() : this.db.authenticate();
    }

    async close(test: ConstrainBoolean = false) {
        return test ? this.dbTest.close() : this.db.close();
    }

    async sync(force: boolean = false, test: boolean = false) {
        return test ? this.dbTest.sync({ force }) : this.db.sync({ force });
    }

    async init(force: boolean = false, test: boolean = false) {
        if (!test && this.dbTest) {
            await this.dbTest.close();
        }
        if (test && this.db) {
            await this.db.close();
        }
        await this.connect(test);
        await this.sync(force, test);
    }
}

export default new SequelizeDb();
