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
exports.deleteById = exports.updateById = exports.getFullDocById = exports.getById = exports.getAll = exports.create = void 0;
const http_status_1 = __importDefault(require("http-status"));
const car_model_1 = __importDefault(require("../models/car.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new Car record
 *
 * @param {NewCarBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarDoc>} A promise containing the new Car record
 */
const create = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    return car_model_1.default.create(reqBody);
});
exports.create = create;
/**
 * Retrieves all Car records
 *
 * @returns {Promise<ICarDoc[]>} A promise containing the all Car records
 */
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return car_model_1.default.find();
});
exports.getAll = getAll;
/**
 * Retrieves the specified Car record
 *
 * @param {string} carId The identifier of the Car to retrieve
 * @returns {Promise<ICarDoc | null>} A promise containing the specified Car record
 */
const getById = (carId) => __awaiter(void 0, void 0, void 0, function* () {
    return car_model_1.default.findById(carId);
});
exports.getById = getById;
/**
 * Gets a Car record, with the forecast populated
 *
 * @param {string} carId The identifier of the Car to update
 * @param {UpdateCarBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarDoc | null>} A promise containing the updated Car record
 */
const getFullDocById = (carId) => __awaiter(void 0, void 0, void 0, function* () {
    let carDoc = yield car_model_1.default.findById(carId);
    if (carDoc) {
        carDoc = yield carDoc.populate({ path: 'forecastId', select: '-createdAt -updatedAt -__v -_id' });
    }
    return carDoc;
});
exports.getFullDocById = getFullDocById;
/**
 * Updates the Car record with the sought identifier.
 *
 * @param {string} carId The identifier of the Car to update
 * @param {UpdateCarBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarDoc | null>} A promise containing the updated Car record
 */
const updateById = (carId, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(carId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
    }
    Object.assign(record, reqBody);
    yield record.save();
    return record;
});
exports.updateById = updateById;
/**
 * Deletes the Car record with the sought identifier.
 *
 * @param {string} carId The identifier of the Car to update
 * @returns {Promise<ICarDoc | null>} A promise containing the deleted Car record.
 */
const deleteById = (carId) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(carId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Car not found');
    }
    yield record.deleteOne();
    return record;
});
exports.deleteById = deleteById;
