import { getNormalUser, getAdminUser } from '@tests/utils/generate-user';
import app from '@app';
import logger from '@utils/logger';
import * as request from 'supertest';

describe('when logged in as a normal user', () => {
    let user;
    beforeAll(async () => {
        user = await getNormalUser();
    });
    void it("can't fetch all users", async () => {
        const res = await request(app)
            .get('/users')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('change his records', async () => {
        const patchedUser = { username: 'Yun Yun' };
        const res = await request(app)
            .patch(`/users/${user.id}`)
            .send(patchedUser)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('delete his account', async () => {
        const res = await request(app)
            .delete(`/users/${user.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });
});

describe('when logged in as an admin user', () => {
    let user;
    let admin;
    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        user = await getNormalUser();
        admin = await getAdminUser();
    });

    void it('can fetch all users', async () => {
        const res = await request(app)
            .get('/users')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${admin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it("can't fetch all users with a page parameters", async () => {
        const res = await request(app)
            .get('/users')
            .query({ page: 1 })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${admin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('change other user records', async () => {
        const patchedUser = { username: 'Yun Yun' };
        const res = await request(app)
            .patch(`/users/${user.id}`)
            .send(patchedUser)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${admin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('delete other user account', async () => {
        const res = await request(app)
            .delete(`/users/${user.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${admin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });
});
