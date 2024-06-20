const request = require('supertest');
const app = require('../app.js');

describe('Login Tests', () => {
  it('should log in a user with correct credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'p@ssword123',
      });

    console.log(response.body); // Add this line for debugging
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
  });

  it('should fail to log in with incorrect credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    console.log(response.body); // Add this line for debugging
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid email or password');
  });
});
