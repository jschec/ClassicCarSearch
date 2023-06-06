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
exports.deleteById = exports.updateById = exports.getByUserId = exports.getById = exports.create = void 0;
const http_status_1 = __importDefault(require("http-status"));
const watch_list_model_1 = __importDefault(require("../models/watch-list.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new WatchList record
 *
 * @param {NewWatchListBody} reqBody The request body supplied by the client
 * @returns {Promise<IWatchListDoc>} A promise containing the new WatchList record
 */
const create = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    return watch_list_model_1.default.create(reqBody);
});
exports.create = create;
/**
 * Retrieves the specified WatchList record
 *
 * @param {string} watchListId The identifier of the WatchList to retrieve
 * @returns {Promise<IWatchListDoc | null>} A promise containing the specified WatchList record
 */
const getById = (watchListId) => __awaiter(void 0, void 0, void 0, function* () {
    return watch_list_model_1.default.findById(watchListId);
});
exports.getById = getById;
/**
 * Retrieves the specified WatchList record
 *
 * @param {string} userId The identifier of the WatchList to retrieve
 * @returns {Promise<IWatchListDoc | null>} A promise containing the specified WatchList record
 */
const getByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return watch_list_model_1.default.findOne({ "user": userId });
});
exports.getByUserId = getByUserId;
/**
 * Updates the WatchList record with the sought identifier.
 *
 * @param {string} watchListId The identifier of the WatchList to update
 * @param {UpdateWatchListBody} reqBody The request body supplied by the client
 * @returns {Promise<IWatchListDoc | null>} A promise containing the updated WatchList record
 */
const updateById = (watchListId, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(watchListId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Watch list not found');
    }
    Object.assign(record, reqBody);
    yield record.save();
    return record;
});
exports.updateById = updateById;
/**
 * Deletes the WatchList record with the sought identifier.
 *
 * @param {string} watchListId The identifier of the WatchList to update
 * @returns {Promise<IWatchListDoc | null>} A promise containing the deleted WatchList record.
 */
const deleteById = (watchListId) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(watchListId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Watch list not found');
    }
    yield record.deleteOne();
    return record;
});
exports.deleteById = deleteById;
