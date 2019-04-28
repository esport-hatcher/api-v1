import {
  generateNormalUser,
  generateBadEmail,
  generateBadPwd
} from '../../utils/generate-user';
import * as request from 'supertest';
import app from '../../../app';

describe('when a user register', () => {
  const newUser = generateNormalUser();

  void it('should return 201 with the right informations', async () => {
    const res = await request(app)
      .post('/users')
      .send(newUser)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
  });

  void it('should return 500 when creating a user that already exist', async () => {
    const res = await request(app)
      .post('/users')
      .send(newUser)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(500);
  });

  void it('should return 422 with bad email', async () => {
    const badEmailUser = generateBadEmail();
    const res = await request(app)
      .post('/users')
      .send(badEmailUser)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(422);
  });

  void it('should return 422 with bad password', async () => {
    const badPwdUser = generateBadPwd();
    const res = await request(app)
      .post('/users')
      .send(badPwdUser)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(422);
  });
});
