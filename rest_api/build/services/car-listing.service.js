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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteById = exports.updateById = exports.getById = exports.getAll = exports.applyQuery = exports.create = void 0;
const http_status_1 = __importDefault(require("http-status"));
const car_listing_model_1 = __importDefault(require("../models/car-listing.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
/**
 * Creates a new CarListing record
 *
 * @param {NewCarListingBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarListingDoc>} A promise containing the new CarListing record
 */
const create = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    return car_listing_model_1.default.create(reqBody);
});
exports.create = create;
/**
 * Applies a query to retrieve populated CarListing records
 *
 * @param {SearchCriteriaRequestPaginated} reqBody The request body supplied by the client
 * @param {boolean} isPaginated If true, the query will be paginated. Defaults to true.
 * @returns {Promise<IPaginationResponse<ICarListingDoc>>} A promise containing the matching CarListing records
 */
const applyQuery = (reqBody, isPaginated = true) => __awaiter(void 0, void 0, void 0, function* () {
    let { page, pageSize, region } = reqBody, carCriteria = __rest(reqBody, ["page", "pageSize", "region"]);
    // Ugly, but necessary to convert page to number
    if (typeof page === 'string') {
        page = parseInt(page);
    }
    // Ugly, but necessary to convert pageSize to number
    if (typeof pageSize === 'string') {
        pageSize = parseInt(pageSize);
    }
    // Create a MongoDB friendly query
    var searchCriteria = {};
    if (region) {
        searchCriteria["region"] = { "$in": region.split(',') };
    }
    for (const [k, v] of Object.entries(carCriteria)) {
        if (k === 'exteriorCondition' || k === 'mechanicalCondition') {
            searchCriteria[`car.${k}`] = { "$in": v.split(',') };
        }
        else if (k === 'startYear') {
            const startYear = typeof v === 'string' ? parseInt(v) : v;
            searchCriteria['car.year'] = { "$gte": startYear };
        }
        else if (k === 'endYear') {
            const endYear = typeof v === 'string' ? parseInt(v) : v;
            searchCriteria['car.year'] = { "$lte": endYear };
        }
        else {
            searchCriteria[`car.${k}`] = v;
        }
    }
    let transformations = [
        {
            $lookup: {
                from: 'cars',
                localField: 'car',
                foreignField: '_id',
                as: 'car'
            }
        },
        {
            $lookup: {
                from: 'carsellers',
                localField: 'seller',
                foreignField: '_id',
                as: 'seller'
            }
        },
        {
            $unwind: '$car',
        },
        {
            $unwind: '$seller',
        },
        {
            $match: searchCriteria
        },
        {
            $sort: { createdAt: -1 }
        },
    ];
    if (isPaginated) {
        transformations.push({
            $facet: {
                records: [
                    { $skip: page * pageSize },
                    { $limit: pageSize }
                ],
                numRecords: [
                    {
                        $count: 'count'
                    }
                ]
            }
        });
    }
    else {
        transformations.push({
            $facet: {
                records: [
                    { $skip: 0 }
                ],
                numRecords: [
                    {
                        $count: 'count'
                    }
                ]
            }
        });
    }
    const aggregation = yield car_listing_model_1.default.aggregate(transformations);
    return {
        page: page,
        pageSize: pageSize,
        numRecords: aggregation[0].numRecords[0] ? aggregation[0].numRecords[0].count : 0,
        records: aggregation[0].records ? aggregation[0].records : []
    };
});
exports.applyQuery = applyQuery;
/**
 * Retrieves all CarListing records
 *
 * @returns {Promise<ICarListingDoc | null>} A promise containing the all CarListing records
 */
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    return car_listing_model_1.default.find();
});
exports.getAll = getAll;
/**
 * Retrieves the specified CarListing record
 *
 * @param {string} carListingId The identifier of the CarListing to retrieve
 * @param {boolean} isPopulated Whether to populate the CarListing record. Defaults to false.
 * @returns {Promise<ICarListingDoc | null>} A promise containing the specified CarListing record
 */
const getById = (carListingId, isPopulated = false) => __awaiter(void 0, void 0, void 0, function* () {
    let record = yield car_listing_model_1.default.findById(carListingId);
    if (record && isPopulated) {
        record = yield record.populate([
            {
                path: 'car',
                select: '-createdAt -updatedAt -__v -_id',
                populate: {
                    path: 'forecast',
                    select: '-createdAt -updatedAt -__v -_id',
                }
            },
            {
                path: 'seller',
                select: '-createdAt -updatedAt -__v -_id',
            },
        ]);
    }
    return record;
});
exports.getById = getById;
/**
 * Updates the CarListing record with the sought identifier.
 *
 * @param {string} carListingId The identifier of the CarListing to update
 * @param {UpdateCarListingBody} reqBody The request body supplied by the client
 * @returns {Promise<ICarListingDoc | null>} A promise containing the updated CarListing record
 */
const updateById = (carListingId, reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(carListingId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Car listing not found');
    }
    Object.assign(record, reqBody);
    yield record.save();
    return record;
});
exports.updateById = updateById;
/**
 * Deletes the CarListing record with the sought identifier.
 *
 * @param {string} carListingId The identifier of the CarListing to update
 * @returns {Promise<ICarListingDoc | null>} A promise containing the deleted CarListing record.
 */
const deleteById = (carListingId) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield (0, exports.getById)(carListingId);
    if (!record) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Car listing not found');
    }
    yield record.deleteOne();
    return record;
});
exports.deleteById = deleteById;
