const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('../src/Swagger/Swagger');
require('../src/DB/mongoose');
const userRouter = require('../src/Routers/user')
const taskRouter = require('../src/Routers/task');
const cors = require('cors');

require('dotenv').config({ path: './config/dev.env' });

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(cors());

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app