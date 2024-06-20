const request = require('supertest');
const app = require('../app');

describe('Create Community', () => {
    it('should fail when name and description are not provided', async () => {
        const res = await request(app)
            .post('/create-community')
            .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'error');
    });

    it('should fail when only name is provided', async () => {
        const res = await request(app)
            .post('/create-community')
            .send({ name: 'Test Community' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'error');
    });

    it('should fail when only description is provided', async () => {
        const res = await request(app)
            .post('/create-community')
            .send({ description: 'This is a test community.' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'error');
    });
    it('should succeed when both name and description are provided', async () => {
        const res = await request(app)
            .post('/create-community')
            .send({
                name: 'Test Community',
                description: 'This is a test community.'
            });
        console.error(res.body); // Log the error message from the server
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('name', 'Test Community');
        expect(res.body).toHaveProperty('description', 'This is a test community.');
    });
});
