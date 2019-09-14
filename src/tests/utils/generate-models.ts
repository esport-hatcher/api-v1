import * as request from 'supertest';
import { app } from '@app';
import { User } from '@models';
import { getRandomTeamProps } from '@utils';

export const getTeam = async (user: User) => {
    const { body } = await request(app)
        .post('/teams')
        .send(getRandomTeamProps())
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${user.getAccessToken()}`);
    return body;
};
