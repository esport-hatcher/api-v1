import * as request from 'supertest';
import { getTeam, getEvent, getUser } from '@tests/utils/modelGenerator';
import { app } from '@app';
import { logger, getRandomEventProps } from '@utils';
import { User, Team, Event } from '@models';

describe('A team owner', () => {
    let teamOwner: User;
    let team: Team;
    let event: Event;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        teamOwner = await getUser();
        team = await getTeam({ user: teamOwner });
        event = await getEvent(team);
    });

    void it('can create an event and it return 201', async () => {
        const newEvent = getRandomEventProps();
        const res = await request(app)
            .post(`/teams/${team.id}/events`)
            .send(newEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('can fetch all events and it return 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch an event by eventId and it return 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can edit the records of an event and it return 200', async () => {
        const patchedEvent = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/events/${event.id}`)
            .send(patchedEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can delete an event and it return 200', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });
});

describe('A team admin', () => {
    let teamAdmin: User;
    let team: Team;
    let event: Event;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        teamAdmin = await getUser();
        team = await getTeam({ user: teamAdmin, role: 'Admin' });
        event = await getEvent(team);
    });

    void it('can create an event and it return 201', async () => {
        const newEvent = getRandomEventProps();
        const res = await request(app)
            .post(`/teams/${team.id}/events`)
            .send(newEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('can fetch all events and it return 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch an event by eventId and it return 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can edit the records of an event and it return 200', async () => {
        const patchedEvent = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/events/${event.id}`)
            .send(patchedEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can delete an event and it return 200', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });
});

describe('A team player', () => {
    let teamPlayer: User;
    let team: Team;
    let event: Event;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        teamPlayer = await getUser();
        team = await getTeam({ user: teamPlayer, role: 'Player' });
        event = await getEvent(team);
    });

    void it('cannot create an event and it return 401', async () => {
        const newEvent = getRandomEventProps();

        const res = await request(app)
            .post(`/teams/${team.id}/events`)
            .send(newEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('can fetch all events from the team and it return 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch an event by eventId and it return 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('cannot edit the records of an event and it return 401', async () => {
        const patchedEvent = { place: 'Seoul' };

        const res = await request(app)
            .patch(`/teams/${team.id}/events/${event.id}`)
            .send(patchedEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot delete an event and it return 401', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(401);
    });
});
