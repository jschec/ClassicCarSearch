# Overview


## Development

### Installing Dependencies

To install dependencies for the Express RESTful API, you will need to execute the `npm install` command in the root of the `rest_api` directory. This will generate a `node_modules` directory with the installed dependencies.

### Code Organization
```
app
    /config         # Configurations for the encapsulated services
    /controllers    # 
    /database       #
    /models         #
    /routes         # RESTful API routes
    /schemas        # Schemas for MongoDB collections (using Mongoose)
    /services       #
    /utils          # utility methods
    index.ts        #
Dockerfile          # Specification for virtualized container for running the server
package.json        # The project's node.js configuration
README.md           # This readme
server.ts           # Entry point for the server
tsconfig.json       # The project's typescript configuration
```

### Dependencies
- cors          #
- express       #
- helmet        #
- http-status   # Contains HTTP response codes
- mongoose      #