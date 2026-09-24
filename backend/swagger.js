const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Pet Adoption API',
      version: '1.0.0',
      description: 'API for managing pets, shelters, adopters, and adoptions',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Adopter: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Alice Smith' },
            email: { type: 'string', example: 'alice@example.com' },
            role: { type: 'string', example: 'user' },
            phone: { type: 'string', example: '36-20-555-1111' },
            address: { type: 'string', example: '123 Main St' },
            city: { type: 'string', example: 'Budapest' },
          },
        },
        Pet: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Bella' },
            species: { type: 'string', example: 'Dog' },
            age: { type: 'integer', example: 3 },
            gender: { type: 'string', example: 'Female' },
            adopted: { type: 'boolean', example: false },
            shelter_id: { type: 'integer', example: 1 },
          },
        },
        Shelter: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Happy Paws Rescue' },
            location: { type: 'string', example: 'Budapest' },
            capacity: { type: 'integer', example: 50 },
            phone: { type: 'string', example: '36-1-555-0100' },
            creation_day: { type: 'string', format: 'date', example: '2020-05-15' },
          },
        },
        Adoption: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            pet_id: { type: 'integer', example: 2 },
            adopter_id: { type: 'integer', example: 2 },
            adoption_date: { type: 'string', format: 'date', example: '2023-10-01' },
            status: { type: 'string', example: 'Approved' },
          },
        },
      },
    },
  },
  apis: ['./route/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;