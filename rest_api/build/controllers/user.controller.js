"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserWatchList = exports.getUser = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const userService = __importStar(require("../services/user.service"));
const watchListService = __importStar(require("../services/watch-list.service"));
const searchService = __importStar(require("../services/search.service"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new User record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 *
 * @returns {Promise<IUserDoc>} A promise containing the new user record
 */
exports.createUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userService.create(req.body);
    res.status(http_status_1.default.CREATED).send(user);
}));
/**
 * Retrieves the specified User record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 *
 * @returns {Promise<IUserDoc>} A promise containing the specified user record
 */
exports.getUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.params['userId']) {
        let user;
        const userId = req.params['userId'];
        if ((_a = req.query) === null || _a === void 0 ? void 0 : _a.fields) {
            const fields = String(req.query.fields).split(",");
            user = yield userService.getByIdWithFields(userId, fields);
        }
        else {
            user = yield userService.getById(userId);
        }
        if (!user) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
        }
        res.send(user);
    }
}));
/**
 * Retrieves the specified User record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 *
 * @returns {Promise<IWatchListDoc>} A promise containing the specified user record
 */
exports.getUserWatchList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['userId']) {
        const userId = req.params['userId'];
        let watchList = yield watchListService.getByUserId(userId);
        if (!watchList) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'WatchList not found');
        }
        const searches = yield searchService.getFullDocByIds(watchList.searches);
        watchList.searches = searches;
        res.send(watchList);
    }
}));
/**
 * Updates the specified User record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 *
 * @returns {Promise<IUserDoc>} A promise containing the updated user record
 */
exports.updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['userId']) {
        const user = yield userService.updateById(req.params['userId'], req.body);
        // Update the session with the new subscription
        if (user && user.subscription) {
            req.user.subscription = user.subscription;
        }
        res.send(user);
    }
}));
/**
 * Deletes the specified User record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 *
 * @returns {Promise<void>} A promise indicating the success of the operation
 */
exports.deleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['userId']) {
        yield userService.deleteById(req.params['userId']);
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
