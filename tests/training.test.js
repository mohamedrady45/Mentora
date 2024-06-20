const request = require('supertest');
const app = require('../app');

describe('Create Training', () => {
    it('should fail when mentor_id, title, and description are not provided', async () => {
        const res = await request(app)
            .post('/create-training')
            .send({});
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'error');
    });

    it('should fail when only mentor_id is provided', async () => {
        const res = await request(app)
            .post('/create-training')
            .send({ mentor_id: '12345' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'error');
    });

    it('should fail when only title is provided', async () => {
        const res = await request(app)
            .post('/create-training')
            .send({ title: 'Test Training' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'error');
    });

    it('should fail when only description is provided', async () => {
        const res = await request(app)
            .post('/create-training')
            .send({ description: 'This is a test training.' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'error');
    });

    it('should succeed when mentor_id, title, and description are provided', async () => {
        const res = await request(app)
            .post('/create-training')
            .send({
                mentor_id: '12345',
                title: 'Test Training',
                description: 'This is a test training.'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('mentor_id', 'title', 'description');
    });
});
