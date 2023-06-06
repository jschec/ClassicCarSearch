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
exports.deleteById = exports.updateById = exports.getById = exports.create = void 0;
const http_status_1 = __importDefault(require("http-status"));
const search_criteria_model_1 = __importDefault(require("../models/search-criteria.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new SearchCriteria record
 *
 * @param {NewSearchCriteriaBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchCriteriaDoc>} A promise containing the new SearchCriteria record
 */
const create = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    return search_criteria_model_1.default.create(reqBody);
});
exports.create = create;
/**
 * Retrieves the specified SearchCriteria record
 *
 * @param {string} searchCriteriaId The identifier of the SearchCriteria to retrieve
 * @returns {Promise<ISearchCriteriaDoc | null>} A promise containing the specified SearchCriteria record
 */
const getById = (searchCriteriaId) => __awaiter(void 0, void 0, void 0, function* () {
    return search_criteria_model_1.default.findById(searchCriteriaId);
});
exports.getById = getById;
/**
 * Updates the SearchCriteria record with the sought identifier.
 *
 * @param {string} searchCriteriaId The identifier of the SearchCriteria to update
 * @param {UpdateSearchCriteriaBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchCriteriaDoc | null>} A promise containing the updated SearchCriteria record
 */
const updateById = (searchCriteriaId, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(searchCriteriaId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Search criteria not found');
    }
    Object.assign(record, reqBody);
    yield record.save();
    return record;
});
exports.updateById = updateById;
/**
 * Deletes the SearchCriteria record with the sought identifier.
 *
 * @param {string} searchCriteriaId The identifier of the SearchCriteria to update
 * @returns {Promise<ISearchCriteriaDoc | null>} A promise containing the deleted SearchCriteria record.
 */
const deleteById = (searchCriteriaId) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(searchCriteriaId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Search criteria not found');
    }
    yield record.deleteOne();
    return record;
});
exports.deleteById = deleteById;
