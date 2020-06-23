import * as request from 'supertest';
import { app } from '@app';
import { logger } from '@utils';
import { User } from '@models';
import { getUser } from '@tests/utils/modelGenerator';

describe('when logged in as a normal user', () => {
    let user: User;
    let secondUser: User;

    beforeAll(async () => {
        user = await getUser();
        secondUser = await getUser();
    });

    void it('can fetch all users and it returns 200', async () => {
        const res = await request(app)
            .get('/users')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('change his records and it returns 200', async () => {
        const patchedUser = { username: 'Yun Yun' };
        const res = await request(app)
            .patch(`/users/${user.id}`)
            .send(patchedUser)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('should return 401 when modifying another user', async () => {
        const patchedUser = { username: 'Yun Yun' };
        const res = await request(app)
            .patch(`/users/${secondUser.id}`)
            .send(patchedUser)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('should return 401 when deleting another user', async () => {
        const res = await request(app)
            .delete(`/users/${secondUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('should return 200 when deleting his account', async () => {
        const res = await request(app)
            .delete(`/users/${user.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });
});

describe('when logged in as an admin user', () => {
    let user: User;
    let admin: User;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        user = await getUser();
        admin = await getUser(true);
    });

    void it('can fetch all users', async () => {
        const res = await request(app)
            .get('/users')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${admin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch all users with a page parameter', async () => {
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

    void it('should not be able to update another user when it does not exist and return 404', async () => {
        const patchedUser = { username: 'Yun Yun' };

        const res = await request(app)
            .patch(`/users/42`)
            .send(patchedUser)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${admin.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should not be able to delete another user when it does not exist and return 404', async () => {
        const res = await request(app)
            .delete(`/users/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${admin.getAccessToken()}`);
        expect(res.status).toBe(404);
    });
});
