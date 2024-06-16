/* Swagger configuration */
const options = {
	openapi: 'OpenAPI 3',   // Enable/Disable OpenAPI. By default is null
	language: 'en-US',      // Change response language. By default is 'en-US'
	disableLogs: false,     // Enable/Disable logs. By default is false
	autoHeaders: false,     // Enable/Disable automatic headers capture. By default is true
	autoQuery: false,       // Enable/Disable automatic query capture. By default is true
	autoBody: false         // Enable/Disable automatic body capture. By default is true
}

const swaggerAutogen = require('swagger-autogen')();

const doc = {
	info: {
		version: '1.0.0',      // by default: '1.0.0'
		title: 'Answer AI',        // by default: 'REST API'
		description: 'API Documentation',  // by default: ''
		contact: {
			'name': 'API Support',
			'email': 'psachan190@gmail.com'
		},
	},
	host: process.env.APP_URL,      // by default: 'localhost:5011'
	basePath: '/',  // by default: '/'
	schemes: ['http'],   // by default: ['http']
	consumes: ['application/json'],  // by default: ['application/json']
	produces: ['application/json'],  // by default: ['application/json']
	tags: [        // by default: empty Array
		{
			name: 'Authentication',
			description: 'Enable user to sign up, login and get refresh token'
		}, {
			name: 'Users',
			description: 'Enable user to sign up, login and get refresh token'
		}, {
			name: 'Questions',
			description: 'Enable user to ask questions and receive their answers'
		}
	],
	securityDefinitions: {},  // by default: empty object
	definitions: {
		
	},          // by default: empty object (Swagger 2.0)
};

const outputFile = './src/docs/swagger.json';
const endpointsFiles = ['./src/app.js', './/*.controllers.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as: index.js, app.js, routes.js, ... */
swaggerAutogen(outputFile, endpointsFiles, doc);

// swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
//     require('./index.js'); // Your project's root file
//   });
