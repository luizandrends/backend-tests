import request from 'supertest';
import app from '../../src/app';

import truncate from '../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
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
