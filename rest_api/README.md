# Overview


## Development

### Installing Dependencies

To install dependencies for the Express RESTful API, you will need to execute the `npm install` command in the root of the `rest_api` directory. This will generate a `node_modules` directory with the installed dependencies.

### Running The Server

To run the RESTful API for development, you can execute the command `npm run dev:start`. Please note that the environmental variables listed in the 'Required Run Time Environmental Variables' section of this documentation must be made available.

### Code Organization
```
app                 # 
    /config         # Configurations for the encapsulated services
    /controllers    # 
    /database       # Configures and initializes database connections
    /models         # 
    /routes         # RESTful API routes
    /schemas        # Schemas for MongoDB collections (using Mongoose)
    /services       #
    /utils          # Utility methods
    index.ts        #
    server.ts       # Entry point for the server
Dockerfile          # Specification for virtualized container for running the server
package.json        # The project's node.js configuration
README.md           # This readme
tsconfig.json       # The project's typescript configuration
```

### Dependencies
- cors          # 
- dotenv        # 
- express       # Minimalist web framework [link](https://expressjs.com/)
- helmet        # 
- http-status   # Contains HTTP response codes [link] (https://www.npmjs.com/package/http-status)
- mongoose      # Schemas for modeling MongoDB data [link] (https://mongoosejs.com/docs/)
- validator     #


### Required Run Time Environmental Variables
APP_ENV         # The staging of the deployment. Allows values include: 'production', 'development', 'test'
APP_PORT        # The port, in which the RESTful API is served on. Defaults to 3000 if no value is provided.
MONGODB_URL     # The MongoDB connection string

### Loading environmental variables
```
set -a # automatically export all variables
source .env
set +a
```