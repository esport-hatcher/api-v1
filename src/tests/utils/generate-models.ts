import * as request from 'supertest';
import { app } from '@app';
import { User, Team, Club } from '@models';
import {
    getRandomClubProps,
    getRandomTeamProps,
    getRandomEventProps,
} from '@utils';

export const getClub = async (user: User) => {
    const { body } = await request(app)
        .post('/clubs')
        .send(getRandomClubProps())
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${user.getAccessToken()}`);
    return body;
};

export const getTeam = async (user: User, club: Club) => {
    const { body } = await request(app)
        .post(`/clubs/${club.id}/teams`)
        .send(getRandomTeamProps())
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${user.getAccessToken()}`);
    return body;
};

export const getEvent = async (user: User, team: Team, club: Club) => {
    const { body } = await request(app)
        .post(`/clubs/${club.id}/teams/${team.id}/events`)
        .send(getRandomEventProps())
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${user.getAccessToken()}`);
    return body;
};
