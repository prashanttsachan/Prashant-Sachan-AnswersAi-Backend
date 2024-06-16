# Node JS Answer AI OA Project

Instruction are given below to start the application in all 3 environments. Though production environment is not included in this. Open api keys are not included due to git hub communite guildlines as it doesn't allows to push OPEN_API_KEYS

Please add the open api key in below mwntioned files.

.env.dev , .env.test , Dockerfile

## Manual Installation

Clone the repo:

```
git clone https://github.com/prashanttsachan/Prashant-Sachan-AnswersAi-Backend
cd Prashant-Sachan-AnswersAi-Backend
```

Install the dependencies:

```
npm run install
```

## Commands

Running locally:

```
npm run start:dev
```

Running in production:

```
npm run start
```

Testing:

```
# run all tests
npm run test
```

## Docker build and installation

Use commands below to prepare the docker image (ENV varibale are set inside the Dockerfile itself)

```
docker build -t {{YOUR_IMAGE_NAME}} .
```

## Project Structure

```
tests\
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--daom\           # Data Access Object for models
 |--middlewares\    # Provide Security Layer in app
 |--models\         # Sequelize models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utilities\      # Utilities classes and functions
 |--validators\     # Request data validation schemas
 |--app.js          # Express app
server.js        # App entry point
```