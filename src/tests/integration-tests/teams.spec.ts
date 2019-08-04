import * as request from 'supertest';
import { getNormalUser, getTeam } from '@tests/utils/generate-models';
import app from '@app';
import logger from '@utils/logger';
import User from '@models/User';

describe('when a user try to create a team', () => {
    let user: User;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        user = await getNormalUser();
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
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
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
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
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
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
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
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(422);
    });
});

describe('when a user try invite an another user in a team', () => {
    let user;
    let invitedUser;
    let team;

    beforeEach(async () => {
        user = await getNormalUser();
        invitedUser = await getNormalUser();
        team = await getTeam(user);
    });

    void it('should return 201 when user invite another user', async () => {
        const res = await request(app)
            .post(`/teams/${team.id}/members/${invitedUser.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('should return 404 when team does not exist', async () => {
        const res = await request(app)
            .post(`/teams/42/members/${invitedUser.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 404 when invited user does not exist', async () => {
        const res = await request(app)
            .post(`/teams/${team.id}/members/42`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 401 when user requesting the invitation is not part of the team', async () => {
        const res = await request(app)
            .post(`/teams/${team.id}/members/${invitedUser.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('should return 401 when user requesting the invitation is not admin or owner', async () => {
        /**
         * Inviting inviteUser as player in the team
         */
        await request(app)
            .post(`/teams/${team.id}/members/${invitedUser.id}`)
            .send({
                role: 'Player',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        /**
         * Creating a third user
         */
        const thirdUser = await getNormalUser();
        /**
         * Making inviteUser invite thirdUser
         */
        const res = await request(app)
            .post(`/teams/${team.id}/members/${thirdUser.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    //userJoinTeam
    void it('should return 201 when a user join a team', async () => {
        const res = await request(app)
            .post(`/teams/userJoinTeam/${team.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it("should return 404 when user try to join a team which doesn't exist", async () => {
        const res = await request(app)
            .post(`/teams/userJoinTeam/fake`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 401 when user have not the rights to join the team requested', async () => {
        const res = await request(app)
            .post(`/teams/userJoinTeam/${team.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json');
        expect(res.status).toBe(401);
    });
});
