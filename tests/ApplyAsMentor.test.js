const request = require('supertest');
const app = require('../app'); // Adjust the path to your app

// Mock data
const validUserCredentials = {
  email: 'testuser@example.com',
  password: 'password123'
};

const validMentorApplication = {
  personalDetails: {
    name: 'Test User',
    email: 'testuser@example.com',
    track: 'Software Engineering',
    experience: '5 years'
  }
};

const invalidMentorApplication = {
  personalDetails: {
    name: '',
    email: 'invalidemail.com',
    track: '',
    experience: ''
  }
};

describe('Apply as Mentor Tests', () => {

  // User Login Test
  it('should log in a user with correct credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send(validUserCredentials);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login successful');
  });

  // Accessing Application Form
  it('should access the Apply as Mentor form', async () => {
    // First login the user
    const loginResponse = await request(app)
      .post('/login')
      .send(validUserCredentials);

    // Simulate accessing the application form
    const formResponse = await request(app)
      .get('/applyAsMentor')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(formResponse.status).toBe(200);
    expect(formResponse.body).toHaveProperty('formFields');
  });

  // Valid Data Submission
  it('should submit the mentor application form with valid data', async () => {
    // First login the user
    const loginResponse = await request(app)
      .post('/login')
      .send(validUserCredentials);

    // Submit the application form
    const response = await request(app)
      .post('/applyAsMentor')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(validMentorApplication);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Application submitted successfully');
  });

  // Invalid Data Submission
  it('should not submit the mentor application form with invalid data', async () => {
    // First login the user
    const loginResponse = await request(app)
      .post('/login')
      .send(validUserCredentials);

    // Submit the application form with invalid data
    const response = await request(app)
      .post('/applyAsMentor')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(invalidMentorApplication);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Please provide correct data');
  });

  // Missing Required Fields
  it('should not submit the mentor application form with missing required fields', async () => {
    // First login the user
    const loginResponse = await request(app)
      .post('/login')
      .send(validUserCredentials);

    // Submit the application form with missing required fields
    const response = await request(app)
      .post('/applyAsMentor')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
        personalDetails: {
          name: 'Test User',
          email: 'testuser@example.com'
          // Missing track and experience fields
        }
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Required fields are missing');
  });

  // System Admin Review and Notification
  it('should allow system admin to review and notify the user of their application status', async () => {
    // Assuming we have a mock admin login and application review flow
    const adminLoginResponse = await request(app)
      .post('/admin/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpassword'
      });

    // Simulate admin reviewing the application
    const reviewResponse = await request(app)
      .post('/admin/reviewApplication')
      .set('Authorization', `Bearer ${adminLoginResponse.body.token}`)
      .send({
        applicationId: 'application123',
        status: 'accepted', // or 'rejected'
        feedback: 'Congratulations, your application is accepted.'
      });

    expect(reviewResponse.status).toBe(200);
    expect(reviewResponse.body).toHaveProperty('message', 'Application reviewed successfully');

    // Verify that the user gets notified (this part might involve another test checking notification endpoint)
  });
});
