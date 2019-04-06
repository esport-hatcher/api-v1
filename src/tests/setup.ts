import sequelize from '../utils/database';

jest.setTimeout(30000);

beforeAll(async () => {
	await sequelize.sync({ force: true });
});

afterAll(async () => {
	await sequelize.close();
});
