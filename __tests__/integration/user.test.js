import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../src/app';

import User from '../../src/app/models/User';
import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password when new user are created', async () => {
    const user = await User.create({
      name: 'Luiz Andre',
      email: 'teste@teste.com',
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Luiz Andre',
        email: 'teste@teste.com',
        password_hash: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('shoult not be alble to register with duplicated email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Luiz Andre',
        email: 'teste@teste.com',
        password_hash: '123456',
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Luiz Andre',
        email: 'teste@teste.com',
        password_hash: '123456',
      });

    expect(response.status).toBe(400);
  });
});
