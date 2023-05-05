# Overview


## Development

### Getting Started
- Install the required dependencies (see the installing dependencies section)
- Add an .env file to the root of the `rest_api` directory
- Make sure the .env file contains the variables outlined in the 'Required Run Time Environmental Variables' section
- Run the server as instructed by the 'Running The Server'

### Installing Dependencies

To install dependencies for the Express RESTful API, you will need to execute the `npm install` command in the root of the `rest_api` directory. This will generate a `node_modules` directory with the installed dependencies.

### Running The Server

To run the RESTful API for development, you can execute the command `npm run dev:start`. Windows users will need to run `npm run dev:start-windows` instead due to OS pathing syntax differences. The windows variant requires you to have a `build` directory and will throw an error if that `build` directory does not exist.

Please note that the environmental variables listed in the 'Required Run Time Environmental Variables' section of this documentation must be made available.

### Running The Population Script

To run the population script, you can execute the command `npm run dev:populate`. Please note that the environmental variables listed in the 'Required Run Time Environmental Variables' section of this documentation must be made available.

### Code Organization
```
src                 # The source code implementations for the Express RESTful API 
    /config         # Configurations for the encapsulated services
    /controllers    # Orchestrates RESTful endpoint business logic
    /interfaces     # Typescript types for models
    /models         # Schemas for MongoDB collections (using Mongoose)
    /routes         # RESTful API routes
    /schemas        # Schemas for MongoDB collections (using Mongoose)
    /services       # Low level interactions with specific MongoDB collections     
    /utils          # Utility methods
    app.ts          # Configurations for Express RESTful API
    server.ts       # Entry point for the RESTful API
Dockerfile          # Specification for virtualized container for running the server
package.json        # The project's node.js configuration
README.md           # This readme
tsconfig.json       # The project's typescript configuration
```

### Dependencies
```
cors          # Enables configuration of Cross-Origin Resource Sharing (CORS) [link](https://www.npmjs.com/package/cors)
dotenv        # Loads environmental variables from .env files [link](https://www.npmjs.com/package/dotenv)
express       # Minimalist web framework [link](https://expressjs.com/)
helmet        # 
http-status   # Contains HTTP response codes [link] (https://www.npmjs.com/package/http-status)
mongoose      # Schemas for modeling MongoDB data [link] (https://mongoosejs.com/docs/)
validator     #
faker         # For mocking data in population script
```


### Required Run Time Environmental Variables
```
APP_ENV         # The staging of the deployment. Allows values include: 'production', 'development', 'test'
APP_PORT        # The port, in which the RESTful API is served on. Defaults to 3000 if no value is provided.
MONGODB_URL     # The MongoDB connection string
```

### Loading environmental variables
```
set -a # automatically export all variables
source .env
set +a
```