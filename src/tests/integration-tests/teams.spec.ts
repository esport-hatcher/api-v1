import { getNormalUser } from '@tests/utils/generate-user';
import * as request from 'supertest';
import app from '@app';
import logger from '@utils/logger';

describe('when a user try to create a team', () => {
    let user;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        user = await getNormalUser();
    });

    void it('should return 401 when does not have a token', async () => {
        const team = {
            name: 'test123',
            region: 'FR',
            game: 'Counter Strike',
        };
        const res = await request(app)
            .post('/teams')
            .send(team)
            .set('Content-Type', 'application/json');
        expect(res.status).toBe(401);
    });

    void it('should return 201 with a correct team', async () => {
        const team = {
            name: 'test123',
            region: 'FR',
            game: 'Counter Strike',
        };
        const res = await request(app)
            .post('/teams')
            .send(team)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('should return 422 with a team which has a too short name', async () => {
        const team = {
            name: 't',
            region: 'FR',
            game: 'Counter Strike',
        };
        const res = await request(app)
            .post('/teams')
            .send(team)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(422);
    });

    void it('should return 422 with a team with no game', async () => {
        const team = {
            name: 'test123',
            region: 'FR',
        };
        const res = await request(app)
            .post('/teams')
            .send(team)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(422);
    });

    void it('should return 422 when registering with an incorrect region', async () => {
        const team = {
            name: 'test123',
            region: 'incorrect_value',
            game: 'Counter Strike',
        };
        const res = await request(app)
            .post('/teams')
            .send(team)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(422);
    });
});

describe('when a user try invite an another user in a team', () => {
    let accessToken: string;
    const inviteUser = {
        email: 'test@esport-hatcher.com',
        password: 'admin',
        username: 'loto',
    };
    const team = {
        name: 'test123',
        region: 'FR',
        game: 'Counter Strike',
    };
    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        accessToken = await getAccessTokenNormalUser();
        await request(app)
            .post('/users')
            .send(inviteUser)
            .set('Content-Type', 'application/json');
        await request(app)
            .post('/teams')
            .send(team)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
    });

    void it('should return 201 when user invit a another user', async () => {
        const res = await request(app)
            .post('/teams/addUser')
            .send({
                userEmail: 'test@esport-hatcher.com',
                role: 'Admin',
                name: 'test123',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(res.status).toBe(201);
    });
    void it('should return 422 when user dont have team', async () => {
        const res = await request(app)
            .post('/teams/addUser')
            .send({
                userEmail: 'test@esport-hatcher.com',
                role: 'Admin',
                name: 'noteam',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(res.status).toBe(422);
    });
    void it('should return 422 when user doesnt exist', async () => {
        const res = await request(app)
            .post('/teams/addUser')
            .send({
                userEmail: 'noUser@esport-hatcher.com',
                role: 'Admin',
                name: 'test123',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(res.status).toBe(422);
    });
});
