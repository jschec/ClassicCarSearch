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
exports.deleteById = exports.updateById = exports.getByIdWithFields = exports.getById = exports.create = void 0;
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = __importDefault(require("../models/user.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new User record
 *
 * @param {NewUserBody} userBody The request body supplied by the client
 * @returns {Promise<IUserDoc>} A promise containing the new User record
 */
const create = (userBody) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield user_model_1.default.isEmailTaken(userBody.email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    return user_model_1.default.create(userBody);
});
exports.create = create;
/**
 * Retrieves the specified User record
 *
 * @param {string} id The identifier of the User to retrieve
 * @returns {Promise<IUserDoc | null>} A promise containing the specified User record
 */
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () { return user_model_1.default.findById(id); });
exports.getById = getById;
/**
 * Retrieves the User record with the specified ID and returns it as a promise.
 *
 * @param {string} id The identifier of the User to retrieve
 * @param {String[]} fields - An array of fields to select from the User record
 * @returns {Promise<IUserDoc | null>} A promise containing the specified User record
 */
const getByIdWithFields = (id, fields) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_model_1.default.findById(id);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    for (let i = 0; i < fields.length; i++) {
        const item = fields[i];
        if (item === "watchlist") {
            user = yield user.populate({
                path: 'watchList',
                select: 'searches -_id'
            });
        }
        else if (item === "subscription") {
            user = yield user.populate({
                path: 'subscription',
                select: 'cost -_id'
            });
        }
    }
    return user;
});
exports.getByIdWithFields = getByIdWithFields;
/**
 * Updates the specified User record
 *
 * @param {string} userId The identifier of the User to update
 * @param {UpdateUserBody} updateBody The request body supplied by the client
 * @returns {Promise<IUserDoc | null>} A promise containing the updated User record
 */
const updateById = (userId, updateBody) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getById)(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (yield user_model_1.default.isEmailTaken(updateBody.email, userId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    yield user.save();
    return user;
});
exports.updateById = updateById;
/**
 * Deletes the User record with the sought identifier.
 *
 * @param {string} userId  The identifier of the user to delete.
 * @returns {Promise<IUserDoc | null>} A promise containing the deleted user record.
 */
const deleteById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.getById)(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    yield user.deleteOne();
    return user;
});
exports.deleteById = deleteById;
