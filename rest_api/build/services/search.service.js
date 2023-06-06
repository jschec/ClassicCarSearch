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
exports.deleteById = exports.updateById = exports.getFullDocByIds = exports.getFullDocById = exports.getById = exports.create = void 0;
const http_status_1 = __importDefault(require("http-status"));
const search_model_1 = __importDefault(require("../models/search.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new Search record
 *
 * @param {NewSearchBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchDoc>} A promise containing the new Search record
 */
const create = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    return search_model_1.default.create(reqBody);
});
exports.create = create;
/**
 * Retrieves the specified Search record
 *
 * @param {string} searchId The identifier of the Search to retrieve
 * @returns {Promise<ISearchDoc | null>} A promise containing the specified Search record
 */
const getById = (searchId) => __awaiter(void 0, void 0, void 0, function* () {
    return search_model_1.default.findById(searchId);
});
exports.getById = getById;
/**
 * Retrieves the specified search record by its identifier.
 *
 * @param {string} searchId The identifier of the Search to retrieve
 * @returns {Promise<ISearchDoc | null>} A promise containing the specified Search record
 */
const getFullDocById = (searchId) => __awaiter(void 0, void 0, void 0, function* () {
    let searchDoc = yield search_model_1.default.findById(searchId);
    if (searchDoc) {
        searchDoc = yield searchDoc.populate([
            {
                path: 'criteria',
                select: '-createdAt -updatedAt -__v -_id',
            },
            {
                path: 'results',
                select: '-createdAt -updatedAt -__v -_id',
                populate: [
                    {
                        path: 'car',
                        select: '-createdAt -updatedAt -__v -_id',
                    },
                    {
                        path: 'seller',
                        select: '-createdAt -updatedAt -__v -_id',
                    },
                ],
            },
        ]);
    }
    return searchDoc;
});
exports.getFullDocById = getFullDocById;
/**
 * Retrieves the specified search record by its identifier.
 *
 * @param {string} searchIds The identifier of the Search to retrieve
 * @returns {Promise<ISearchDoc[]>} A promise containing the specified Search record
 */
const getFullDocByIds = (searchIds) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield search_model_1.default.find({ _id: { $in: searchIds } }).populate([
        {
            path: 'criteria',
            select: '-createdAt -updatedAt -__v -_id',
        },
        {
            path: 'results',
            select: '-createdAt -updatedAt -__v -_id',
            populate: [
                {
                    path: 'car',
                    select: '-createdAt -updatedAt -__v -_id',
                },
                {
                    path: 'seller',
                    select: '-createdAt -updatedAt -__v -_id',
                },
            ],
        },
    ]);
    return result;
});
exports.getFullDocByIds = getFullDocByIds;
/**
 * Updates the Search record with the sought identifier.
 *
 * @param {string} searchId The identifier of the Search to update
 * @param {UpdateSearchBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchDoc | null>} A promise containing the updated Search record
 */
const updateById = (searchId, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(searchId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Search not found');
    }
    Object.assign(record, reqBody);
    yield record.save();
    return record;
});
exports.updateById = updateById;
/**
 * Deletes the Search record with the sought identifier.
 *
 * @param {string} searchId The identifier of the Search to update
 * @returns {Promise<ISearchDoc | null>} A promise containing the deleted Search record.
 */
const deleteById = (searchId) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(searchId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Search not found');
    }
    yield record.deleteOne();
    return record;
});
exports.deleteById = deleteById;
