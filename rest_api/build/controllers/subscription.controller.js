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
exports.deleteSubscription = exports.updateSubscription = exports.getSubscriptions = exports.getSubscription = exports.createSubscription = void 0;
const http_status_1 = __importDefault(require("http-status"));
const subscriptionService = __importStar(require("../services/subscription.service"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new Subscription record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 *
 * @returns {Promise<ISubscriptionDoc>} A promise containing the new Subscription record
 */
exports.createSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield subscriptionService.create(req.body);
    res.status(http_status_1.default.CREATED).send(subscription);
}));
/**
 * Retrieves the specified Subscription record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 *
 * @returns {Promise<ISubscriptionDoc>} A promise containing the specified Subscription record
 */
exports.getSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['subscriptionId']) {
        const subscription = yield subscriptionService.getById(req.params['subscriptionId']);
        if (!subscription) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Subscription not found');
        }
        res.send(subscription);
    }
}));
/**
 * Retrieves all Subscription records
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 *
 * @returns {Promise<ISubscriptionDoc>} A promise containing all Subscription records
 */
exports.getSubscriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield subscriptionService.getAll();
    res.send(records);
}));
/**
 * Updates the specified Subscription record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 *
 * @returns {Promise<ISubscriptionDoc>} A promise containing the updated Subscription record
 */
exports.updateSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['subscriptionId']) {
        const subscription = yield subscriptionService.updateById(req.params['subscriptionId'], req.body);
        res.send(subscription);
    }
}));
/**
 * Deletes the specified Subscription record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 *
 * @returns {Promise<void>} A promise indicating the success of the operation
 */
exports.deleteSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['subscriptionId']) {
        yield subscriptionService.deleteById(req.params['subscriptionId']);
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
