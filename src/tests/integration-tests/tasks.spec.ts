import * as request from 'supertest';
import { getTeam, getTask, getUser } from '@tests/utils/modelGenerator';
import { app } from '@app';
import { logger, getRandomTaskProps } from '@utils';
import { User, Team, Task } from '@models';

describe('A team owner', () => {
    let teamOwner: User;
    let team: Team;
    let task: Task;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        teamOwner = await getUser();
        team = await getTeam({ user: teamOwner });
        task = await getTask(team);
    });

    void it('can create an task and it returns 201', async () => {
        const newTask = getRandomTaskProps();
        const res = await request(app)
            .post(`/teams/${team.id}/tasks`)
            .send(newTask)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('can fetch all tasks and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/tasks`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch an task by taskId and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/tasks/${task.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can edit the records of an task and it returns 200', async () => {
        const patchedTask = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/tasks/${task.id}`)
            .send(patchedTask)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can delete an task and it returns 200', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/tasks/${task.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('cannot fetch an task who does not exist and it returns 404', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/tasks/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('cannot edit an task who does not exist and it returns 404', async () => {
        const patchedTask = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/tasks/42`)
            .send(patchedTask)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('cannot delete an etask who does not exist and it returns 404', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/tasks/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    describe('have methods to manage users in tasks', () => {
        let otherTeamUser: User;

        beforeAll(async () => {
            otherTeamUser = await getUser();
            task = await getTask(team);
            await team.addPlayer(otherTeamUser);
        });

        void it('can invite a new team member in the task and it returns 201', async () => {
            const res = await request(app)
                .post(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
            expect(res.status).toBe(201);
        });

        void it('can get all the team members from an task and it returns 200', async () => {
            const res = await request(app)
                .get(`/teams/${team.id}/tasks/${task.id}/users`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can get an TaskUser by his id and it returns 200', async () => {
            const res = await request(app)
                .get(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can patch an TaskUser and it returns 200', async () => {
            const res = await request(app)
                .patch(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can delete a team member from an task and it returns 200', async () => {
            const res = await request(app)
                .delete(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('cannot invite a member that is not in the team in the task and it returns 422', async () => {
            const userNotInTeam = await getUser();

            const res = await request(app)
                .post(
                    `/teams/${team.id}/tasks/${task.id}/users/${userNotInTeam.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamOwner.getAccessToken()}`);

            expect(res.status).toBe(422);
        });

        describe('and working with a team user who is not in the task', () => {
            let userNotInTask: User;

            beforeAll(async () => {
                userNotInTask = await getUser();
                await team.addPlayer(userNotInTask);
            });

            void it('cannot get him by his id in the task and it returns 422', async () => {
                const res = await request(app)
                    .get(
                        `/teams/${team.id}/tasks/${task.id}/users/${userNotInTask.id}`
                    )
                    .set('Content-Type', 'application/json')
                    .set(
                        'Authorization',
                        `Bearer ${teamOwner.getAccessToken()}`
                    );
                expect(res.status).toBe(422);
            });

            void it('cannot update him in the task and it returns 422', async () => {
                const res = await request(app)
                    .patch(
                        `/teams/${team.id}/tasks/${task.id}/users/${userNotInTask.id}`
                    )
                    .set('Content-Type', 'application/json')
                    .set(
                        'Authorization',
                        `Bearer ${teamOwner.getAccessToken()}`
                    );
                expect(res.status).toBe(422);
            });

            void it('cannot delete him from the task and it returns 422', async () => {
                const res = await request(app)
                    .delete(
                        `/teams/${team.id}/tasks/${task.id}/users/${userNotInTask.id}`
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
    let task: Task;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        teamAdmin = await getUser();
        team = await getTeam({ user: teamAdmin, role: 'Admin' });
        task = await getTask(team);
    });

    void it('can create an task and it returns 201', async () => {
        const newTask = getRandomTaskProps();
        const res = await request(app)
            .post(`/teams/${team.id}/tasks`)
            .send(newTask)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(201);
    });

    void it('can fetch all tasks and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/tasks`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch an task by taskId and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/tasks/${task.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can edit the records of an task and it returns 200', async () => {
        const patchedTask = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/tasks/${task.id}`)
            .send(patchedTask)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can delete an task and it returns 200', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/tasks/${task.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('cannot fetch an task who does not exist and it returns 404', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/tasks/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('cannot edit an task who does not exist and it returns 404', async () => {
        const patchedTask = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/tasks/42`)
            .send(patchedTask)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    void it('cannot delete an etask who does not exist and it returns 404', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/tasks/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    describe('have methods to manage users in tasks', () => {
        let otherTeamUser: User;

        beforeAll(async () => {
            otherTeamUser = await getUser();
            task = await getTask(team);
            await team.addPlayer(otherTeamUser);
        });

        void it('can invite a new team member in the task and it returns 201', async () => {
            const res = await request(app)
                .post(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(201);
        });

        void it('can get all the team members from an task and it returns 200', async () => {
            const res = await request(app)
                .get(`/teams/${team.id}/tasks/${task.id}/users`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can get an TaskUser by his id and it returns 200', async () => {
            const res = await request(app)
                .get(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can patch an TaskUser and it returns 200', async () => {
            const res = await request(app)
                .patch(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can delete a team member from an task and it returns 200', async () => {
            const res = await request(app)
                .delete(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('cannot invite a member that is not in the team in the task and it returns 422', async () => {
            const userNotInTeam = await getUser();

            const res = await request(app)
                .post(
                    `/teams/${team.id}/tasks/${task.id}/users/${userNotInTeam.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamAdmin.getAccessToken()}`);
            expect(res.status).toBe(422);
        });

        describe('and working with a team user who is not in the task', () => {
            let userNotInTask: User;

            beforeAll(async () => {
                userNotInTask = await getUser();
                await team.addPlayer(userNotInTask);
            });

            void it('cannot get him by his id in the task and it returns 422', async () => {
                const res = await request(app)
                    .get(
                        `/teams/${team.id}/tasks/${task.id}/users/${userNotInTask.id}`
                    )
                    .set('Content-Type', 'application/json')
                    .set(
                        'Authorization',
                        `Bearer ${teamAdmin.getAccessToken()}`
                    );
                expect(res.status).toBe(422);
            });

            void it('cannot update him in the task and it returns 422', async () => {
                const res = await request(app)
                    .patch(
                        `/teams/${team.id}/tasks/${task.id}/users/${userNotInTask.id}`
                    )
                    .set('Content-Type', 'application/json')
                    .set(
                        'Authorization',
                        `Bearer ${teamAdmin.getAccessToken()}`
                    );
                expect(res.status).toBe(422);
            });

            void it('cannot delete him from the task and it returns 422', async () => {
                const res = await request(app)
                    .delete(
                        `/teams/${team.id}/tasks/${task.id}/users/${userNotInTask.id}`
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
    let task: Task;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        teamPlayer = await getUser();
        team = await getTeam({ user: teamPlayer, role: 'Player' });
        task = await getTask(team);
    });

    void it('cannot create an task and it returns 401', async () => {
        const newTask = getRandomTaskProps();

        const res = await request(app)
            .post(`/teams/${team.id}/tasks`)
            .send(newTask)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('can fetch all tasks from the team and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/tasks`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('can fetch an task by taskId and it returns 200', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/tasks/${task.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(200);
    });

    void it('cannot edit the records of an task and it returns 401', async () => {
        const patchedTask = { place: 'Seoul' };

        const res = await request(app)
            .patch(`/teams/${team.id}/tasks/${task.id}`)
            .send(patchedTask)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot delete an task and it returns 401', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/tasks/${task.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot fetch an task who does not exist and it returns 404', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/tasks/42`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
        expect(res.status).toBe(404);
    });

    describe('have methods to retrieve information about users in tasks', () => {
        let otherTeamUser: User;

        beforeAll(async () => {
            otherTeamUser = await getUser();
            task = await getTask(team);
            await team.addPlayer(otherTeamUser);
            await task.addUser(otherTeamUser);
        });

        void it('cannot invite a new team member in the task and it returns 401', async () => {
            const res = await request(app)
                .post(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('can get all the team members from an task and it returns 200', async () => {
            const res = await request(app)
                .get(`/teams/${team.id}/tasks/${task.id}/users`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('can get an TaskUser by his id and it returns 200', async () => {
            const res = await request(app)
                .get(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
            expect(res.status).toBe(200);
        });

        void it('cannot patch an TaskUser and it returns 401', async () => {
            const res = await request(app)
                .patch(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${teamPlayer.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('cannot delete a team member from an task and it returns 401', async () => {
            const res = await request(app)
                .delete(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
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
    let task: Task;

    beforeAll(async () => {
        logger('Tests', 'Generating access token...');
        randomUser = await getUser();
        team = await getTeam();
        task = await getTask(team);
    });

    void it('cannot create an task and it returns 401', async () => {
        const newTask = getRandomTaskProps();
        const res = await request(app)
            .post(`/teams/${team.id}/tasks`)
            .send(newTask)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot fetch all tasks and it returns 401', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/tasks`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot fetch an task by taskId and it returns 401', async () => {
        const res = await request(app)
            .get(`/teams/${team.id}/tasks/${task.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot edit the records of an task and it returns 401', async () => {
        const patchedTask = { place: 'Seoul' };
        const res = await request(app)
            .patch(`/teams/${team.id}/tasks/${task.id}`)
            .send(patchedTask)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    void it('cannot delete an task and it returns 401', async () => {
        const res = await request(app)
            .delete(`/teams/${team.id}/tasks/${task.id}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
        expect(res.status).toBe(401);
    });

    describe('does not have methods to manage users in tasks', () => {
        let otherTeamUser: User;

        beforeAll(async () => {
            otherTeamUser = await getUser();
            task = await getTask(team);
            await team.addPlayer(otherTeamUser);
        });

        void it('cannot invite a new team member in the task and it returns 401', async () => {
            const res = await request(app)
                .post(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('cannot get all the team members from an task and it returns 401', async () => {
            const res = await request(app)
                .get(`/teams/${team.id}/tasks/${task.id}/users`)
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('cannot get an TaskUser by his id and it returns 401', async () => {
            const res = await request(app)
                .get(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('cannot patch an TaskUser and it returns 401', async () => {
            const res = await request(app)
                .patch(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
            expect(res.status).toBe(401);
        });

        void it('cannot delete a team member from an task and it returns 401', async () => {
            const res = await request(app)
                .delete(
                    `/teams/${team.id}/tasks/${task.id}/users/${otherTeamUser.id}`
                )
                .set('Content-Type', 'application/json')
                .set('Authorization', `Bearer ${randomUser.getAccessToken()}`);
            expect(res.status).toBe(401);
        });
    });
});
