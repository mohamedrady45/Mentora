const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mentora',
            version: '1.0.0',
            description: 'Mentora website',
        },
        servers: [
            {
                url: "http://localhost:4000", // Replace with your actual server URL
                description: "Local server"
            },
            // Add other server URLs here if you have multiple environments
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT Bearer token in this format: Bearer {token}',
                },
            },
        },
        security: [
            {
                bearerAuth: []
            }
        ],
    },
    apis: ['./routers/*.js'], // Path to the API route files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
