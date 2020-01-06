import * as request from 'supertest';
import { app } from '@app';
import { User, Team } from '@models';
import { getRandomTeamProps, getRandomEventProps } from '@utils';

export const getTeam = async (user: User) => {
    const { body } = await request(app)
        .post('/teams')
        .send(getRandomTeamProps())
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${user.getAccessToken()}`);
    return body;
};

export const getEvent = async (user: User, team: Team) => {
    const { body } = await request(app)
        .post(`/teams/${team.id}/events`)
        .send(getRandomEventProps())
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${user.getAccessToken()}`);
    return body;
};
