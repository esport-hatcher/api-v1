import { generateNormalTeam } from '@tests/utils/generate-team';
import { generateNormalUser } from '@tests/utils/generate-user';
import * as request from 'supertest';
import app from '@app';

const newUser = generateNormalUser();
const newTeam = generateNormalTeam();

// tslint:disable-next-line:only-arrow-functions
function createLoginToken(server, loginDetails, done) {
    request(server)
        .post('/users')
        .send(loginDetails)
        // tslint:disable-next-line:only-arrow-functions
        .end(function(error, response) {
            if (error) {
                throw error;
            }
            const loginToken = response.body.token;
            done(loginToken);
        });
}

describe('when a user creat a team', () => {
    it('should get all the meals', done => {
        // tslint:disable-next-line:only-arrow-functions
        createLoginToken(app, newUser, function(header) {
            request(app)
                .post('/teams')
                .send(newTeam)
                .set('Authorization', `${header}`)
                .expect(200)
                .expect(res => {
                    expect(res.status).toBe(201);
                })
                .end(done);
        });
    });
    /* let token = '';
    void it('should return 201', async () => {
        const r = await request(app)
            .post('/users')
            .send(newUser)
            .set('Content-Type', 'application/json');
        token = r.body;
        console.log(newTeam, token);
        const res = await request(app)
            .post('/teams')
            .set('Authorization', token)
            .set('Content-Type', 'application/json')
            .send(newTeam);
        expect(res.status).toBe(201);*/
});
