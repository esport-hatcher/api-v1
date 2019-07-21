import { getNormalUser } from '@tests/utils/generate-user';
import app from '@app';
import logger from '@utils/logger';
import * as request from 'supertest';

describe('when a user read, update or delete', () => {
    let user;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        user = await getNormalUser();
    });

    void it('GET all users', async () => {
        const res = await request(app)
            .get('/')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('GET page 1 users', async () => {
        const res = await request(app)
            .get('/')
            .query({ page: 1 })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('PATCH an user', async () => {
        const patchedUser = { username: 'Yun Yun' };
        const res = await request(app)
            .patch(`/${user.id}`)
            .send(patchedUser)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('DELETE an user', async () => {
        const res = await request(app)
            .delete(`/${user.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });
});
