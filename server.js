const app = require('./src/app');
const config = require('./src/config/config');

console.info('Node Js Starter with Sequelize ORM!!');
// require('./cronJobs');
// eslint-disable-next-line import/order
const http = require('http');
// socket initialization
const server = http.createServer(app);
// eslint-disable-next-line import/order

server.listen(config.APP_PORT, () => {
    console.log(`Server Listening on port ${config.APP_PORT}`);
});
