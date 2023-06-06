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
exports.deleteSearchCriteria = exports.updateSearchCriteria = exports.getSearchCriteria = exports.createSearchCriteria = void 0;
const http_status_1 = __importDefault(require("http-status"));
const searchCriteriaService = __importStar(require("../services/search-criteria.service"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new SearchCriteria record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchCriteriaDoc>} A promise containing the new SearchCriteria record
 */
exports.createSearchCriteria = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield searchCriteriaService.create(req.body);
    res.status(http_status_1.default.CREATED).send(record);
}));
/**
 * Retrieves the specified SearchCriteria record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchCriteriaDoc>} A promise containing the specified SearchCriteria record
 */
exports.getSearchCriteria = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['searchCriteriaId']) {
        const record = yield searchCriteriaService.getById(req.params['searchCriteriaId']);
        if (!record) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Search criteria not found');
        }
        res.send(record);
    }
}));
/**
 * Updates the specified SearchCriteria record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ISearchCriteriaDoc>} A promise containing the updated SearchCriteria record
 */
exports.updateSearchCriteria = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['searchCriteriaId']) {
        const record = yield searchCriteriaService.updateById(req.params['searchCriteriaId'], req.body);
        res.send(record);
    }
}));
/**
 * Deletes the specified SearchCriteria record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<void>} A promise indicating the success of the operation
 */
exports.deleteSearchCriteria = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['searchCriteriaId']) {
        yield searchCriteriaService.deleteById(req.params['searchCriteriaId']);
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
