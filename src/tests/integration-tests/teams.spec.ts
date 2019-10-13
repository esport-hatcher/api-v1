import * as request from 'supertest';
import { getTeam } from '@tests/utils/generate-models';
import { app } from '@app';
import { logger, getUser } from '@utils';
import { User } from '@models';

describe('when a user try to create a team', () => {
    let user: User;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        user = await getUser();
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

describe('when a TeamUser try invite an another user in a team', () => {
    let user: User;
    let invitedUser: User;
    let team;

    beforeEach(async () => {
        user = await getUser();
        invitedUser = await getUser();
        team = await getTeam(user);
    });

    void it('should return 201 when user invite another user', async () => {
        const res = await request(app)
            .post(`/teams/${team.id}/members/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('should return 404 when team does not exist', async () => {
        const res = await request(app)
            .post(`/teams/42/members/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 404 when invited user does not exist', async () => {
        const res = await request(app)
            .post(`/teams/${team.id}/members/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 401 when user requesting the invitation is not part of the team', async () => {
        const res = await request(app)
            .post(`/teams/${team.id}/members/${invitedUser.id}`)
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
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        /**
         * Creating a third user
         */
        const thirdUser = await getUser();
        /**
         * Making inviteUser invite thirdUser
         */
        const res = await request(app)
            .post(`/teams/${team.id}/members/${thirdUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });
    void it('should return 201 when user accept the request of another user', async () => {
        /**
         * invitedUser requesting to join the Team
         */
        await request(app)
            .post(`/users/${invitedUser.id}/teams/${team.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
        /**
         * user accepting invitedUser's request
         */
        const res = await request(app)
            .post(`/teams/${team.id}/members/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });
});

describe('When a user try to join a team', () => {
    let user: User;
    let teamOwner: User;
    let team;

    beforeAll(async () => {
        user = await getUser();
        teamOwner = await getUser();
        team = await getTeam(teamOwner);
    });

    void it('should return 201 when a user join a team', async () => {
        const res = await request(app)
            .post(`/users/${user.id}/teams/${team.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it("should return 404 when user try to join a team which doesn't exist", async () => {
        const res = await request(app)
            .post(`/users/${user.id}/teams/44`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 201 when a user accept to join a team who already invited him', async () => {
        /**
         * teamOwner requesting user to join the team
         */
        await request(app)
            .post(`/teams/${team.id}/members/${user.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        /**
         * user accepting teamOwner request
         */
        const res = await request(app)
            .post(`/users/${user.id}/teams/${team.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });
});
describe('When a user try to quit a team', () => {
    let user: User;
    let teamOwner: User;
    let team;

    beforeAll(async () => {
        user = await getUser();
        teamOwner = await getUser();
        team = await getTeam(teamOwner);
    });

    void it("should return 404 if the user isn't in any team", async () => {
        /**
         * user trying to quit a team without being in one.
         */
        const res = await request(app)
            .delete(`/users/${user.id}/teams/${team.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 200 when a user quit a team', async () => {
        /**
         * teamOwner requesting user to join the team.
         */
        await request(app)
            .post(`/teams/${team.id}/members/${user.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        /**
         * user accepting teamOwner request.
         */
        await request(app)
            .post(`/users/${user.id}/teams/${team.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        /**
         * user quitting a team.
         */
        const res = await request(app)
            .delete(`/users/${user.id}/teams/${team.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it("should return 404 if the team doesn't exist", async () => {
        /**
         * teamOwner requesting user to join the team.
         */
        await request(app)
            .post(`/teams/${team.id}/members/${user.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        /**
         * user accepting teamOwner request.
         */
        await request(app)
            .post(`/users/${user.id}/teams/${team.id}`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        /**
         * User trying to quit a team that doesn't exist.
         */
        const res = await request(app)
            .delete(`/users/${user.id}/teams/42/`)
            .send({
                role: 'Admin',
            })
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(404);
    });
});
