"use strict";
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
exports.deleteById = exports.updateById = exports.getById = exports.getAll = exports.create = void 0;
const http_status_1 = __importDefault(require("http-status"));
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new Subscription record
 *
 * @param {NewSubscriptionBody} reqBody The request body supplied by the client
 * @returns {Promise<ISubscriptionDoc>} A promise containing the new Subscription record
 */
const create = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield subscription_model_1.default.isNameTaken(reqBody.name)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Name already taken');
    }
    return subscription_model_1.default.create(reqBody);
});
exports.create = create;
/**
 * Retrieves all Subscription records
 *
 * @returns {Promise<ISubscriptionDoc[]>} A promise containing the all Subscription records
 */
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return subscription_model_1.default.find();
});
exports.getAll = getAll;
/**
 * Retrieves the specified Subscription record
 *
 * @param {string} id The identifier of the Subscription to retrieve
 * @returns {Promise<ISubscriptionDoc | null>} A promise containing the specified Subscription record
 */
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return subscription_model_1.default.findById(id);
});
exports.getById = getById;
/**
 * Updates the Subscription record with the sought identifier.
 *
 * @param {string} subscriptionId The identifier of the Subscription to update
 * @param {UpdateSubscriptionBody} reqBody The request body supplied by the client
 * @returns {Promise<ISubscriptionDoc | null>} A promise containing the updated Subscription record
 */
const updateById = (subscriptionId, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield (0, exports.getById)(subscriptionId);
    if (!subscription) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Subscription not found');
    }
    if (reqBody.name && (yield subscription_model_1.default.isNameTaken(reqBody.name, subscriptionId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Name already taken');
    }
    Object.assign(subscription, reqBody);
    yield subscription.save();
    return subscription;
});
exports.updateById = updateById;
/**
 * Deletes the Subscription record with the sought identifier.
 *
 * @param {string} subscriptionId The identifier of the Subscription to update
 * @returns {Promise<IUserDoc | null>} A promise containing the deleted user record.
 */
const deleteById = (subscriptionId) => __awaiter(void 0, void 0, void 0, function* () {
    const subscription = yield (0, exports.getById)(subscriptionId);
    if (!subscription) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Subscription not found');
    }
    yield subscription.deleteOne();
    return subscription;
});
exports.deleteById = deleteById;
