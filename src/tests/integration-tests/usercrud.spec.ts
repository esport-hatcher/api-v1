import {
    getAccessTokenNormalUser,
    // generateNormalUser,
} from '@tests/utils/generate-user';
import app from '@app';
import logger from '@utils/logger';
import * as request from 'supertest';

// const newUser = generateNormalUser();

describe('when a user read, update or delete', () => {
    let accessToken: string;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        accessToken = await getAccessTokenNormalUser();
    });

    void it('GET all users', async () => {
        const res = await request(app)
            .get('/')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
    });

    void it('GET page 1 users', async () => {
        const res = await request(app)
            .get('/')
            .query({ page: 1 })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`);
        expect(res.status).toBe(200);
    });

    // void it('PATCH an user', async () => {
    //     const patchedUser = { username: 'Yun Yun' };
    //     const res = await request(app)
    //         .patch('/' + newUser.id)
    //         .send(patchedUser)
    //         .set('Content-Type', 'application/json')
    //         .set('Authorization', `Bearer ${accessToken}`);
    //     expect(res.status).toBe(200);
    // });

    // void it('DELETE an user', async () => {
    //     const res = await request(app)
    //         .delete('/' + newUser.id)
    //         .set('Content-Type', 'application/json')
    //         .set('Authorization', `Bearer ${accessToken}`);
    //     expect(res.status).toBe(200);
    // });
});
