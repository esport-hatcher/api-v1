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

/*
export const teamAddMember = async (
    teamOwner: User,
    invitedUser: User,
    team: Team
) => {
    /**
     * teamOwner requesting user to join the team.
     *
    await request(app)
        .post(`/teams/${team.id}/members/${invitedUser.id}`)
        .send({
            role: 'Admin',
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
    /**
     * user accepting teamOwner request.
     *
    const { body } = await request(app)
        .post(`/users/${invitedUser.id}/teams/${team.id}`)
        .send({
            role: 'Admin',
        })
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
    return body;
};*/
