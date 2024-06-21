const request = require('supertest');
const app = require('../app.js');

describe('Request to Have a Mentor Tests', () => {
  it('should successfully request a mentor', async () => {
    const response = await request(app)
      .post('/requestMentor')
      .send({
        userId: 'user123',
        mentorDetails: {
          track: 'Software Engineering',
          language: 'English',
          type: 'One Time session',
        }
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Mentor requested successfully');
  });

  it('should fail to request a mentor with incomplete data', async () => {
    const response = await request(app)
      .post('/requestMentor')
      .send({
        userId: 'user123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Required fields are missing');
  });
});
