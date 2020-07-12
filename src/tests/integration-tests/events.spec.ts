import * as request from 'supertest';
import { getTeam, getEvent, getUser } from '@tests/utils/modelGenerator';
import { app } from '@app';
import { logger, getRandomEventProps } from '@utils';
import { User, Team, Event } from '@models';

describe('A regular user', () => {
    let user: User;
    let secondUser: User;
    let event: Event;

    beforeAll(async () => {
        user = await getUser();
        secondUser = await getUser();
        event = await getEvent(user);
    });

    void it('can create a personal event and it returns 201', async () => {
        const res = await request(app)
            .post(`/users/${user.id}/events`)
            .send(getRandomEventProps())
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('can fetch all events and it returns 200', async () => {
        const res = await request(app)
            .get(`/users/${user.id}/events`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch an event by his id and it returns 200', async () => {
        const res = await request(app)
            .get(`/users/${user.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can update an event and it returns 200', async () => {
        const res = await request(app)
            .patch(`/users/${user.id}/events/${event.id}`)
            .send(getRandomEventProps())
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch all events and it returns 200', async () => {
        const res = await request(app)
            .delete(`/users/${user.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${user.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('cannot create personal events for another user and it returns 401', async () => {
        const res = await request(app)
            .post(`/users/${user.id}/events`)
            .send(getRandomEventProps())
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${secondUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot fetch the events of another user and it returns 401', async () => {
        const res = await request(app)
            .get(`/users/${user.id}/events`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${secondUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });
});

describe('A team owner', () => {
    let teamOwner: User;
    let team: Team;
    let event: Event;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        teamOwner = await getUser();
        team = await getTeam({ user: teamOwner });
        event = await getEvent(null, team);
    });

    void it('can create an event and it returns 201', async () => {
        const newEvent = getRandomEventProps();
        const res = await request(app)
            .post(`/teams/${team.id}/events`)
            .send(newEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('can fetch all events and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch an event by eventId and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can edit the records of an event and it returns 200', async () => {
        const patchedEvent = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/events/${event.id}`)
            .send(patchedEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can delete an event and it returns 200', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('cannot fetch an event who does not exist and it returns 404', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('cannot edit an event who does not exist and it returns 404', async () => {
        const patchedEvent = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/events/42`)
            .send(patchedEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('cannot delete an event who does not exist and it returns 404', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/events/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    describe('have methods to manage users in events', () => {
        let otherTeamUser: User;

        beforeAll(async () => {
            otherTeamUser = await getUser();
            event = await getEvent(null, team);
            await team.addPlayer(otherTeamUser);
        });

        void it('can invite a new team member in the event and it returns 201', async () => {
            const res = await request(app)
                .post(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
            expect(res.status).toBe(201);
        });

        void it('can get all the team members from an event and it returns 200', async () => {
            const res = await request(app)
                .get(`/teams/${team.id}/events/${event.id}/users`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can get an EventUser by his id and it returns 200', async () => {
            const res = await request(app)
                .get(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can patch an EventUser and it returns 200', async () => {
            const res = await request(app)
                .patch(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can delete a team member from an event and it returns 200', async () => {
            const res = await request(app)
                .delete(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('cannot invite a member that is not in the team in the event and it returns 422', async () => {
            const userNotInTeam = await getUser();

            const res = await request(app)
                .post(
                    `/teams/${team.id}/events/${event.id}/users/${userNotInTeam.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);

            expect(res.status).toBe(422);
        });

        describe('and working with a team user who is not in the event', () => {
            let userNotInEvent: User;

            beforeAll(async () => {
                userNotInEvent = await getUser();
                await team.addPlayer(userNotInEvent);
            });

            void it('cannot get him by his id in the event and it returns 422', async () => {
                const res = await request(app)
                    .get(
                        `/teams/${team.id}/events/${event.id}/users/${userNotInEvent.id}`
                    )
                    .set('Content-Type', 'application/json')
                    .set(
                        'Authorization',
                        `Bearer ${teamOwner.getAccessToken()}`
                    );
                expect(res.status).toBe(422);
            });

            void it('cannot update him in the event and it returns 422', async () => {
                const res = await request(app)
                    .patch(
                        `/teams/${team.id}/events/${event.id}/users/${userNotInEvent.id}`
                    )
                    .set('Content-Type', 'application/json')
                    .set(
                        'Authorization',
                        `Bearer ${teamOwner.getAccessToken()}`
                    );
                expect(res.status).toBe(422);
            });

            void it('cannot delete him from the event and it returns 422', async () => {
                const res = await request(app)
                    .delete(
                        `/teams/${team.id}/events/${event.id}/users/${userNotInEvent.id}`
                    )
                    .set('Content-Type', 'application/json')
                    .set(
                        'Authorization',
                        `Bearer ${teamOwner.getAccessToken()}`
                    );
                expect(res.status).toBe(422);
            });
        });
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
        event = await getEvent(null, team);
    });

    void it('can create an event and it returns 201', async () => {
        const newEvent = getRandomEventProps();
        const res = await request(app)
            .post(`/teams/${team.id}/events`)
            .send(newEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('can fetch all events and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch an event by eventId and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can edit the records of an event and it returns 200', async () => {
        const patchedEvent = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/events/${event.id}`)
            .send(patchedEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can delete an event and it returns 200', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('cannot fetch an event who does not exist and it returns 404', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('cannot edit an event who does not exist and it returns 404', async () => {
        const patchedEvent = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/events/42`)
            .send(patchedEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('cannot delete an event who does not exist and it returns 404', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/events/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    describe('have methods to manage users in events', () => {
        let otherTeamUser: User;

        beforeAll(async () => {
            otherTeamUser = await getUser();
            event = await getEvent(null, team);
            await team.addPlayer(otherTeamUser);
        });

        void it('can invite a new team member in the event and it returns 201', async () => {
            const res = await request(app)
                .post(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(201);
        });

        void it('can get all the team members from an event and it returns 200', async () => {
            const res = await request(app)
                .get(`/teams/${team.id}/events/${event.id}/users`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can get an EventUser by his id and it returns 200', async () => {
            const res = await request(app)
                .get(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can patch an EventUser and it returns 200', async () => {
            const res = await request(app)
                .patch(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can delete a team member from an event and it returns 200', async () => {
            const res = await request(app)
                .delete(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('cannot invite a member that is not in the team in the event and it returns 422', async () => {
            const userNotInTeam = await getUser();

            const res = await request(app)
                .post(
                    `/teams/${team.id}/events/${event.id}/users/${userNotInTeam.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(422);
        });

        describe('and working with a team user who is not in the event', () => {
            let userNotInEvent: User;

            beforeAll(async () => {
                userNotInEvent = await getUser();
                await team.addPlayer(userNotInEvent);
            });

            void it('cannot get him by his id in the event and it returns 422', async () => {
                const res = await request(app)
                    .get(
                        `/teams/${team.id}/events/${event.id}/users/${userNotInEvent.id}`
                    )
                    .set('Content-Type', 'application/json')
                    .set(
                        'Authorization',
                        `Bearer ${teamAdmin.getAccessToken()}`
                    );
                expect(res.status).toBe(422);
            });

            void it('cannot update him in the event and it returns 422', async () => {
                const res = await request(app)
                    .patch(
                        `/teams/${team.id}/events/${event.id}/users/${userNotInEvent.id}`
                    )
                    .set('Content-Type', 'application/json')
                    .set(
                        'Authorization',
                        `Bearer ${teamAdmin.getAccessToken()}`
                    );
                expect(res.status).toBe(422);
            });

            void it('cannot delete him from the event and it returns 422', async () => {
                const res = await request(app)
                    .delete(
                        `/teams/${team.id}/events/${event.id}/users/${userNotInEvent.id}`
                    )
                    .set('Content-Type', 'application/json')
                    .set(
                        'Authorization',
                        `Bearer ${teamAdmin.getAccessToken()}`
                    );
                expect(res.status).toBe(422);
            });
        });
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
        event = await getEvent(null, team);
    });

    void it('cannot create an event and it returns 401', async () => {
        const newEvent = getRandomEventProps();

        const res = await request(app)
            .post(`/teams/${team.id}/events`)
            .send(newEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('can fetch all events from the team and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch an event by eventId and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('cannot edit the records of an event and it returns 401', async () => {
        const patchedEvent = { place: 'Seoul' };

        const res = await request(app)
            .patch(`/teams/${team.id}/events/${event.id}`)
            .send(patchedEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot delete an event and it returns 401', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot fetch an event who does not exist and it returns 404', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    describe('have methods to retrieve information about users in events', () => {
        let otherTeamUser: User;

        beforeAll(async () => {
            otherTeamUser = await getUser();
            event = await getEvent(null, team);
            await team.addPlayer(otherTeamUser);
            await event.addUser(otherTeamUser);
        });

        void it('cannot invite a new team member in the event and it returns 401', async () => {
            const res = await request(app)
                .post(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('can get all the team members from an event and it returns 200', async () => {
            const res = await request(app)
                .get(`/teams/${team.id}/events/${event.id}/users`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can get an EventUser by his id and it returns 200', async () => {
            const res = await request(app)
                .get(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('cannot patch an EventUser and it returns 401', async () => {
            const res = await request(app)
                .patch(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('cannot delete a team member from an event and it returns 401', async () => {
            const res = await request(app)
                .delete(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
            expect(res.status).toBe(401);
        });
    });
});

describe('A random user who is not in the team', () => {
    let randomUser: User;
    let team: Team;
    let event: Event;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        randomUser = await getUser();
        team = await getTeam();
        event = await getEvent(null, team);
    });

    void it('cannot create an event and it returns 401', async () => {
        const newEvent = getRandomEventProps();
        const res = await request(app)
            .post(`/teams/${team.id}/events`)
            .send(newEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot fetch all events and it returns 401', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot fetch an event by eventId and it returns 401', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot edit the records of an event and it returns 401', async () => {
        const patchedEvent = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/events/${event.id}`)
            .send(patchedEvent)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot delete an event and it returns 401', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/events/${event.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    describe('does not have methods to manage users in events', () => {
        let otherTeamUser: User;

        beforeAll(async () => {
            otherTeamUser = await getUser();
            event = await getEvent(null, team);
            await team.addPlayer(otherTeamUser);
        });

        void it('cannot invite a new team member in the event and it returns 401', async () => {
            const res = await request(app)
                .post(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('cannot get all the team members from an event and it returns 401', async () => {
            const res = await request(app)
                .get(`/teams/${team.id}/events/${event.id}/users`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('cannot get an EventUser by his id and it returns 401', async () => {
            const res = await request(app)
                .get(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('cannot patch an EventUser and it returns 401', async () => {
            const res = await request(app)
                .patch(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('cannot delete a team member from an event and it returns 401', async () => {
            const res = await request(app)
                .delete(
                    `/teams/${team.id}/events/${event.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
            expect(res.status).toBe(401);
        });
    });
});
