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
exports.deleteCarSeller = exports.updateCarSeller = exports.getCarSellers = exports.getCarSeller = exports.createCarSeller = void 0;
const http_status_1 = __importDefault(require("http-status"));
const carSellerService = __importStar(require("../services/car-seller.service"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new CarSeller record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarSellerDoc>} A promise containing the new CarSeller record
 */
exports.createCarSeller = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield carSellerService.create(req.body);
    res.status(http_status_1.default.CREATED).send(record);
}));
/**
 * Retrieves the specified CarSeller record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarSellerDoc[]>} A promise containing the specified CarSeller record
 */
exports.getCarSeller = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['carSellerId']) {
        const record = yield carSellerService.getById(req.params['carSellerId']);
        if (!record) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Car seller not found');
        }
        res.send(record);
    }
}));
/**
 * Retrieves all CarSeller records
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarSellerDoc>} A promise containing all CarSeller records
 */
exports.getCarSellers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const records = yield carSellerService.getAll();
    res.send(records);
}));
/**
 * Updates the specified CarSeller record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<ICarSellerDoc>} A promise containing the updated CarSeller record
 */
exports.updateCarSeller = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['carSellerId']) {
        const record = yield carSellerService.updateById(req.params['carSellerId'], req.body);
        res.send(record);
    }
}));
/**
 * Deletes the specified CarSeller record
 *
 * @param {Request} req The request supplied by the client
 * @param {Response} res The response to be sent to the client
 * @returns {Promise<void>} A promise indicating the success of the operation
 */
exports.deleteCarSeller = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params['carSellerId']) {
        yield carSellerService.deleteById(req.params['carSellerId']);
        res.status(http_status_1.default.NO_CONTENT).send();
    }
}));
