const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Task manager APIs',
    version: '1.0.0',
    description: 'My API Description',
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/Routers/task.js', './src/Routers/user.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
