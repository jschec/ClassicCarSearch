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
exports.deleteSearch = exports.updateSearch = exports.getSearchForecasts = exports.applySearch = exports.getSearchByParam = exports.getSearch = exports.createSearch = void 0;
const http_status_1 = __importDefault(require("http-status"));
const carListingService = __importStar(require("../services/car-listing.service"));
const searchCriteriaService = __importStar(require("../services/search-criteria.service"));
const searchForecastService = __importStar(require("../services/search-forecast.service"));
const searchService = __importStar(require("../services/search.service"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new Search record
 *
 * @param {Request<SearchCriteriaRequest>} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchDoc>} A promise containing the new Search record
 */
exports.createSearch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Apply the search criteria to the CarListing records
    const matchingListings = yield carListingService.applyQuery(Object.assign({ page: 0, pageSize: -1 }, req.body), false);
    const listingIds = matchingListings.records.map(listing => listing._id);
    const record = yield searchService.create(Object.assign(Object.assign({}, req.body), { results: listingIds }));
    // Create the SearchCriteria record
    let searchCriteria = {};
    for (let [k, v] of Object.entries(req.body)) {
        if (k === "region" || k === "exteriorCondition" || k === "mechanicalCondition") {
            searchCriteria[k] = v.split(',');
        }
        else {
            searchCriteria[k] = v;
        }
    }
    yield searchCriteriaService.create(Object.assign(Object.assign({}, searchCriteria), { search: record._id }));
    res.status(http_status_1.default.CREATED).send(record);
}));
/**
 * Retrieves the specified Search record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchDoc>} A promise containing the specified Search record
 */
exports.getSearch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['searchId']) {
        const record = yield searchService.getFullDocById(req.params['searchId']);
        if (!record) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Search not found');
        }
        res.send(record);
    }
}));
/**
 * Retrieves the specified Search record
 *
 * @param {Request<SearchQueryRequest>} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchDoc[]>} A promise containing the specified Search record
 */
exports.getSearchByParam = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield searchService.getFullDocByIds(req.body.ids);
    res.send(record);
}));
/**
 * Retrieves the matching CarListing records
 *
 * @param {Request<SearchCriteriaRequestPaginated>} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<IPaginationResponse<ICarListingDoc>>} A promise containing the paginated records
 */
exports.applySearch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = req.query.page ? parseInt(req.query.page) : 0;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const records = yield carListingService.applyQuery(Object.assign({ page, pageSize }, req.query));
    res.send(records);
}));
/**
 * Retrieves the specified Search record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchForecastDoc>} A promise containing the specified SearchForecast records
 */
exports.getSearchForecasts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['searchId']) {
        const records = yield searchForecastService.getBySearchId(req.params['searchId']);
        res.send(records);
    }
}));
/**
 * Updates the specified Search record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchDoc>} A promise containing the updated Search record
 */
exports.updateSearch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['searchId']) {
        const record = yield searchService.updateById(req.params['searchId'], req.body);
        res.send(record);
    }
}));
/**
 * Deletes the specified Search record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<void>} A promise indicating the success of the operation
 */
exports.deleteSearch = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['searchId']) {
        yield searchService.deleteById(req.params['searchId']);
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
