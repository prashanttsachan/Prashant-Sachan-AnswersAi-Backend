const express = require('express');
const cors = require('cors');
const httpStatus = require('http-status');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utilities/ApiError');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
process.env.PWD = process.cwd();

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// enable cors
app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
    const data = {
        message: 'Congratulations! You\'re Live!',
        uptime: 'Server Running since '+ Date(),
    }
    res.status(200).send(data);
});

app.use('/api', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);
const db = require('./models');

db.sequelize.sync();

module.exports = app;
