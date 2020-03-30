import * as request from 'supertest';
import { getTeam, getUser } from '@tests/utils/modelGenerator';
import { app } from '@app';
import { logger } from '@utils';
import { User, Team } from '@models';

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

describe('when a user try inviting an another user in a team', () => {
    let teamOwner: User;
    let invitedUser: User;
    let team: Team;

    beforeAll(async () => {
        teamOwner = await getUser();
        invitedUser = await getUser();
        team = await getTeam({ user: teamOwner });
    });

    void it('should return 201 when a team owner or team admin invite another user', async () => {
        const res = await request(app)
            .post(`/teams/${team.id}/users/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('should return 404 when team does not exist', async () => {
        const res = await request(app)
            .post(`/teams/42/users/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 404 when invited user does not exist', async () => {
        const res = await request(app)
            .post(`/teams/${team.id}/users/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 401 when user requesting the invitation is not part of the team', async () => {
        const res = await request(app)
            .post(`/teams/${team.id}/users/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('should return 401 when user requesting the invitation is not admin or owner', async () => {
        const teamPlayer = await getUser();

        await team.addUser(teamPlayer, {
            through: {
                role: 'Player',
                teamStatus: true,
                playerStatus: true,
            },
        });
        const res = await request(app)
            .post(`/teams/${team.id}/users/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('should return 201 when user accept the request of another user', async () => {
        await team.addUser(invitedUser, {
            through: {
                role: 'Player',
                playerStatus: true,
                teamStatus: false,
            },
        });
        const res = await request(app)
            .post(`/teams/${team.id}/users/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(201);
    });
});

describe('When a user try to join a team', () => {
    let invitedUser: User;
    let teamOwner: User;
    let team: Team;

    beforeAll(async () => {
        invitedUser = await getUser();
        teamOwner = await getUser();
        team = await getTeam({ user: teamOwner });
    });

    void it('should return 201 when a user join a team', async () => {
        const res = await request(app)
            .post(`/users/${invitedUser.id}/teams/${team.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it("should return 404 when user try to join a team which doesn't exist", async () => {
        const res = await request(app)
            .post(`/users/${invitedUser.id}/teams/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 201 when a user accept to join a team who already invited him', async () => {
        await team.addUser(invitedUser, {
            through: {
                role: 'Player',
                playerStatus: false,
                teamStatus: true,
            },
        });
        /**
         * user accepting team requesst
         */
        const res = await request(app)
            .post(`/users/${invitedUser.id}/teams/${team.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
        expect(res.status).toBe(201);
    });
});
