const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('../src/Swagger/Swagger');
require('dotenv').config({ path: './config/dev.env' });

require('../src/DB/mongoose');
const userRouter = require('../src/Routers/user')
const taskRouter = require('../src/Routers/task');
const cors = require('cors');

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
const port = process.env.PORT

app.use(cors());

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);


app.listen(port , () => {
    console.log("server is listening on port " + port);
});