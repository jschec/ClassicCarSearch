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
exports.deleteById = exports.updateById = exports.getBySearchId = exports.getById = exports.create = void 0;
const http_status_1 = __importDefault(require("http-status"));
const search_forecast_model_1 = __importDefault(require("../models/search-forecast.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new SearchForecast record
 *
 * @param {NewSearchForecastBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchForecastDoc>} A promise containing the new SearchForecast record
 */
const create = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    return search_forecast_model_1.default.create(reqBody);
});
exports.create = create;
/**
 * Retrieves the specified SearchForecast record
 *
 * @param {string} searchForecastId The identifier of the SearchForecast to retrieve
 * @returns {Promise<ISearchForecastDoc | null>} A promise containing the specified SearchForecast record
 */
const getById = (searchForecastId) => __awaiter(void 0, void 0, void 0, function* () {
    return search_forecast_model_1.default.findById(searchForecastId);
});
exports.getById = getById;
/**
 * Retrieves the specified SearchForecast record by searchId
 *
 * @param {string} searchId The identifier of the Search to retrieve SearchForecast for
 * @returns {Promise<ISearchForecastDoc | null>} A promise containing the specified SearchForecast record
 */
const getBySearchId = (searchId) => __awaiter(void 0, void 0, void 0, function* () {
    return search_forecast_model_1.default.find({ searchId: searchId });
});
exports.getBySearchId = getBySearchId;
/**
 * Updates the SearchForecast record with the sought identifier.
 *
 * @param {string} searchForecastId The identifier of the SearchForecast to update
 * @param {UpdateSearchForecastBody} reqBody The request body supplied by the client
 * @returns {Promise<ISearchForecastDoc | null>} A promise containing the updated SearchForecast record
 */
const updateById = (searchForecastId, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(searchForecastId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Search forecast not found');
    }
    Object.assign(record, reqBody);
    yield record.save();
    return record;
});
exports.updateById = updateById;
/**
 * Deletes the SearchForecast record with the sought identifier.
 *
 * @param {string} searchForecastId The identifier of the SearchForecast to update
 * @returns {Promise<ISearchForecastDoc | null>} A promise containing the deleted SearchForecast record.
 */
const deleteById = (searchForecastId) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(searchForecastId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Search forecast not found');
    }
    yield record.deleteOne();
    return record;
});
exports.deleteById = deleteById;
