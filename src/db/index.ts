import { sqlDb, sqlHost, sqlPassword, sqlPort, sqlUser } from '@config/keys';
import { Sequelize } from 'sequelize';

class SequelizeDb {
    private db: Sequelize;
    private dbTest: Sequelize;

    constructor() {
        this.credentials();
    }

    createInstance(db: string) {
        const { NODE_ENV, SEQUELIZE_LOGS } = process.env;
        return new Sequelize(db, sqlUser, sqlPassword, {
            dialect: 'mysql',
            host: sqlHost,
            port: sqlPort,
            logging:
                NODE_ENV === 'PROD' || NODE_ENV === 'CI'
                    ? false
                    : SEQUELIZE_LOGS === 'false'
                    ? false
                    : true,
        });
    }
    credentials() {
        this.db = this.createInstance(sqlDb);
        this.dbTest = this.createInstance('eh_test');
    }

    getDb(test: boolean = false) {
        return test ? this.dbTest : this.db;
    }

    async connect(test: boolean) {
        return test ? this.dbTest.authenticate() : this.db.authenticate();
    }

    async close(test: ConstrainBoolean) {
        return test ? this.dbTest.authenticate() : this.db.close();
    }

    async sync(force: boolean, test: boolean) {
        return test ? this.dbTest.sync({ force }) : this.db.sync({ force });
    }

    async init(force: boolean = false, test: boolean = false) {
        await this.connect(test);
        await this.sync(force, test);
    }
}

export default new SequelizeDb();
