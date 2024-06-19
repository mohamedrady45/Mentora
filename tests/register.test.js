const request = require('supertest'); // Importing supertest for HTTP assertions
const app = require('../app'); // Importing the Express app

describe('Registration Tests', () => {
  // Test case for successful user registration
  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/register') // Sending a POST request to the /register endpoint
      .send({
        email: 'test@example.com',
        password: 'password123',
        otp: '123456',
        personalDetails: {
          name: 'Test User',
          age: 25,
        }
      });

    expect(response.status).toBe(201); // Expecting a 201 status code (created)
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  // Test case for registration with an incorrect OTP
  it('should fail to register with an incorrect OTP', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        otp: 'wrong_otp',
      });

    expect(response.status).toBe(400); // Expecting a 400 status code (bad request)
    expect(response.body).toHaveProperty('error', 'Invalid OTP');
  });
});
