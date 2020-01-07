import * as request from 'supertest';
import { getTeam, getClub } from '@tests/utils/generate-models';
import { app } from '@app';
import { logger, getUser } from '@utils';
import { User, Club } from '@models';

describe('when a user try to create a team', () => {
    let user: User;
    let club: Club;
    let team;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        user = await getUser();
        club = await getClub(user);
        team = await getTeam(user, club);
    });

    void it('should return 401 when does not have a token', async () => {
        const res = await request(app)
            .post(`/clubs/${club.id}/teams`)
            .send(team)
            .set('Content-Type', 'application/json');
        expect(res.status).toBe(401);
    });

    void it('should return 201 with a correct team', async () => {
        const res = await request(app)
            .post(`/clubs/${club.id}/teams`)
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
            .post(`/clubs/${club.id}/teams`)
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
            .post(`/clubs/${club.id}/teams`)
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
            .post(`/clubs/${club.id}/teams`)
            .send(team)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(422);
    });
});

describe('when a TeamUser try invite an another user in a team', () => {
    let user: User;
    let invitedUser: User;
    let club: Club;
    let team;

    beforeEach(async () => {
        user = await getUser();
        invitedUser = await getUser();
        club = await getClub(user);
        team = await getTeam(user, club);
    });

    void it('should return 201 when user invite another user', async () => {
        const res = await request(app)
            .post(
                `/clubs/${club.id}/teams/${team.id}/members/${invitedUser.id}`
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('should return 404 when team does not exist', async () => {
        const res = await request(app)
            .post(`/clubs/${club.id}/teams/42/members/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 404 when invited user does not exist', async () => {
        const res = await request(app)
            .post(`/clubs/${club.id}/teams/${team.id}/members/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 401 when user requesting the invitation is not part of the team', async () => {
        const res = await request(app)
            .post(
                `/clubs/${club.id}/teams/${team.id}/members/${invitedUser.id}`
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('should return 401 when user requesting the invitation is not admin or owner', async () => {
        /**
         * Inviting inviteUser as player in the team
         */
        await request(app)
            .post(
                `/clubs/${club.id}/teams/${team.id}/members/${invitedUser.id}`
            )
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
            .post(`/clubs/${club.id}/teams/${team.id}/members/${thirdUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });
    void it('should return 201 when user accept the request of another user', async () => {
        /**
         * invitedUser requesting to join the Team
         */
        await request(app)
            .post(`/users/${invitedUser.id}/clubs/${club.id}/teams/${team.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${invitedUser.getAccessToken()}`);
        /**
         * user accepting invitedUser's request
         */
        const res = await request(app)
            .post(
                `/clubs/${club.id}/teams/${team.id}/members/${invitedUser.id}`
            )
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });
});

describe('When a user try to join a team', () => {
    let user: User;
    let teamOwner: User;
    let club: Club;
    let team;

    beforeAll(async () => {
        user = await getUser();
        teamOwner = await getUser();
        club = await getClub(teamOwner);
        team = await getTeam(teamOwner, club);
    });

    void it('should return 201 when a user join a team', async () => {
        const res = await request(app)
            .post(`/users/${user.id}/clubs/${club.id}/teams/${team.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it("should return 404 when user try to join a team which doesn't exist", async () => {
        const res = await request(app)
            .post(`/users/${user.id}/clubs/${club.id}/teams/44`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('should return 201 when a user accept to join a team who already invited him', async () => {
        /**
         * teamOwner requesting user to join the team
         */
        await request(app)
            .post(`/clubs/${club.id}/teams/${team.id}/members/${user.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        /**
         * user accepting teamOwner request
         */
        const res = await request(app)
            .post(`/users/${user.id}/clubs/${club.id}/teams/${team.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });
});
