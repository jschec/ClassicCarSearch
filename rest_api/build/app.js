"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const errors_1 = require("./utils/errors");
require("./utils/GoogleOAuth");
const app = (0, express_1.default)();
// Enable cors
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
// Enable user sessions
app.use((0, express_session_1.default)(Object.assign(Object.assign({}, config_1.default.session), { store: connect_mongo_1.default.create(Object.assign({}, config_1.default.sessionStore)) })));
// Parse json request body
app.use(express_1.default.json());
// Parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// Passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Map application API routes
app.use('/api', routes_1.default);
app.use('/', express_1.default.static(`${__dirname}/static`));
// Send back a 404 error for any unknown API request
app.use((_req, _res, next) => {
    next(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Not found'));
});
// Convert error to ApiError, if needed
app.use(errors_1.errorConverter);
// Handle errors
app.use(errors_1.errorHandler);
exports.default = app;
