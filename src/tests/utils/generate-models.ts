import * as request from 'supertest';
import { app } from '@app';
import { User, Team, Organization } from '@models';
import {
    getRandomOrganizationProps,
    getRandomTeamProps,
    getRandomEventProps,
} from '@utils';

export const getOrganization = async (user: User) => {
    const { body } = await request(app)
        .post('/organizations')
        .send(getRandomOrganizationProps())
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${user.getAccessToken()}`);
    return body;
};

export const getTeam = async (user: User, organization: Organization) => {
    const { body } = await request(app)
        .post(`/organizations/${organization.id}/teams`)
        .send(getRandomTeamProps())
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${user.getAccessToken()}`);
    return body;
};

export const getEvent = async (
    user: User,
    team: Team,
    organization: Organization
) => {
    const { body } = await request(app)
        .post(`/organizations/${organization.id}/teams/${team.id}/events`)
        .send(getRandomEventProps())
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${user.getAccessToken()}`);
    return body;
};
