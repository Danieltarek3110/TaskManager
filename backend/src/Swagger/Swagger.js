const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = {
openapi: '3.0.0',
info: {
title: 'Task manager APIs',
version: '1.0.0',
description: 'My API Description',
},
};

const options = {
swaggerDefinition,
apis: ['./src/Routers/task.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;