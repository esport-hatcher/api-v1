import { getAccessTokenNormalUser } from '@tests/utils/generate-user';
import * as request from 'supertest';
import app from '@app';
import logger from '@utils/logger';

describe('when a user try to create a team', () => {
    let accessToken: string;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        accessToken = await getAccessTokenNormalUser();
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
            .set('Authorization', `Bearer ${accessToken}`);
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
            .set('Authorization', `Bearer ${accessToken}`);
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
            .set('Authorization', `Bearer ${accessToken}`);
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
            .set('Authorization', `Bearer ${accessToken}`);
        expect(res.status).toBe(422);
    });
});
