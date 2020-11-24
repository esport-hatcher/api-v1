var path = require('path')
var configuration = {
    migrationsDir: path.resolve(__dirname, 'migrations'),
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    db: process.env.SQL_DB,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD
};

console.log(configuration)

require('./src/migrations/migration').run(configuration);