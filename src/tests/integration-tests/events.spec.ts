import * as request from 'supertest';
import { getTeam, getEvent } from '@tests/utils/generate-models';
import { app } from '@app';
import { logger, getUser, getRandomEventProps } from '@utils';
import { User, Team, Event } from '@models';

describe('when an admin user try to create an event', () => {
    let adminUser: User;
    let team: Team;
    let event: Event;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        adminUser = await getUser(true);
        team = await getTeam(adminUser);
        event = await getEvent(adminUser, team);
    });

    void it('should return 201 after creation', async () => {
        const newEvent = getRandomEventProps();
        const res = await request(app)
            .post(`/teams/${team.id}/events`)
            .send(newEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${adminUser.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('can fetch all events and return 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${adminUser.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch an event by eventId and return 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${adminUser.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can edit the records of the event and return 200', async () => {
        const patchedEvent = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/events/${event.id}`)
            .send(patchedEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${adminUser.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can delete the event and return 200', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${adminUser.getAccessToken()}`);
        expect(res.status).toBe(200);
    });
});

describe('when a regular user try to create an event', () => {
    let invitedUser: User;
    let adminUser: User;
    let team: Team;
    let event: Event;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        invitedUser = await getUser();
        adminUser = await getUser(true);
        team = await getTeam(adminUser);
        event = await getEvent(adminUser, team);
    });

    void it('should return 401 when try to create an event', async () => {
        const newEvent = getRandomEventProps();
        /**
         * Inviting inviteUser as player in the team
         */
        await request(app)
            .post(`/teams/${team.id}/members/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${adminUser.getAccessToken()}`);
        /**
         * Creating a third user
         */
        const thirdUser = await getUser();
        /**
         * Making inviteUser invite thirdUser
         */
        const res = await request(app)
            .post(`/teams/${team.id}/events`)
            .send(newEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${thirdUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('should return 401 when try to fetch all events', async () => {
        /**
         * Inviting inviteUser as player in the team
         */
        await request(app)
            .post(`/teams/${team.id}/members/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${adminUser.getAccessToken()}`);
        /**
         * Creating a third user
         */
        const thirdUser = await getUser();
        /**
         * Making inviteUser invite thirdUser
         */
        const res = await request(app)
            .get(`/teams/${team.id}/events`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${thirdUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('should return 401 when try to fetch an event by eventId', async () => {
        /**
         * Inviting inviteUser as player in the team
         */
        await request(app)
            .post(`/teams/${team.id}/members/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${adminUser.getAccessToken()}`);
        /**
         * Creating a third user
         */
        const thirdUser = await getUser();
        /**
         * Making inviteUser invite thirdUser
         */
        const res = await request(app)
            .get(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${thirdUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('should return 401 when try to change records of an event', async () => {
        const patchedEvent = { place: 'Seoul' };
        /**
         * Inviting inviteUser as player in the team
         */
        await request(app)
            .post(`/teams/${team.id}/members/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${adminUser.getAccessToken()}`);
        /**
         * Creating a third user
         */
        const thirdUser = await getUser();
        /**
         * Making inviteUser invite thirdUser
         */
        const res = await request(app)
            .patch(`/teams/${team.id}/events/${event.id}`)
            .send(patchedEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${thirdUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('should return 401 when try to delete an event', async () => {
        /**
         * Inviting inviteUser as player in the team
         */
        await request(app)
            .post(`/teams/${team.id}/members/${invitedUser.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${adminUser.getAccessToken()}`);
        /**
         * Creating a third user
         */
        const thirdUser = await getUser();
        /**
         * Making inviteUser invite thirdUser
         */
        const res = await request(app)
            .delete(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${thirdUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });
});
