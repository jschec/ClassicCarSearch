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
const car_seller_model_1 = __importDefault(require("../models/car-seller.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new CarSeller record
 *
 * @param {NewCarSellerBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarSellerDoc>} A promise containing the new CarSeller record
 */
const create = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield car_seller_model_1.default.isEmailTaken(reqBody.email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    return car_seller_model_1.default.create(reqBody);
});
exports.create = create;
/**
 * Retrieves all CarSeller records
 *
 * @returns {Promise<ICarSellerDoc[]>} A promise containing the all CarSeller records
 */
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return car_seller_model_1.default.find();
});
exports.getAll = getAll;
/**
 * Retrieves the specified CarSeller record
 *
 * @param {string} carSellerId The identifier of the CarSeller to retrieve
 * @returns {Promise<ICarSellerDoc | null>} A promise containing the specified CarSeller record
 */
const getById = (carSellerId) => __awaiter(void 0, void 0, void 0, function* () {
    return car_seller_model_1.default.findById(carSellerId);
});
exports.getById = getById;
/**
 * Updates the CarSeller record with the sought identifier.
 *
 * @param {string} carSellerId The identifier of the CarSeller to update
 * @param {UpdateCarSellerBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarSellerDoc | null>} A promise containing the updated CarSeller record
 */
const updateById = (carSellerId, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(carSellerId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Car seller not found');
    }
    if (reqBody.email && (yield car_seller_model_1.default.isEmailTaken(reqBody.email, carSellerId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(record, reqBody);
    yield record.save();
    return record;
});
exports.updateById = updateById;
/**
 * Deletes the CarSeller record with the sought identifier.
 *
 * @param {string} carSellerId The identifier of the CarSeller to update
 * @returns {Promise<ICarSellerDoc | null>} A promise containing the deleted CarSeller record.
 */
const deleteById = (carSellerId) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(carSellerId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Car seller not found');
    }
    yield record.deleteOne();
    return record;
});
exports.deleteById = deleteById;
