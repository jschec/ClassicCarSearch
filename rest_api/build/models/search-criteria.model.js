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
const crypto_1 = require("crypto");
const mongoose_1 = require("mongoose");
const condition_interfaces_1 = require("../interfaces/condition.interfaces");
const region_interfaces_1 = require("../interfaces/region.interfaces");
const search_model_1 = __importDefault(require("./search.model"));
const toJson_1 = __importDefault(require("../utils/toJson"));
const searchCriteriaSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.UUID,
        default: () => (0, crypto_1.randomUUID)(),
    },
    search: {
        type: mongoose_1.Schema.Types.UUID,
        required: true,
        ref: 'Search',
    },
    region: {
        type: [String],
        required: false,
        enum: Object.values(region_interfaces_1.Region),
    },
    startYear: {
        type: Number,
        required: false,
        min: 1885,
        max: new Date().getFullYear() + 1 // Can't be newer than next year,
    },
    endYear: {
        type: Number,
        required: false,
        min: 1885,
        max: new Date().getFullYear() + 1 // Can't be newer than next year,
    },
    maxMileage: {
        type: Number,
        required: false,
        min: 0,
        max: 1000000 // 1 million miles
    },
    maxPrice: {
        type: Number,
        required: false,
        min: 0,
        max: 100000000 // 100 million
    },
    exteriorCondition: {
        type: [String],
        required: false,
        enum: Object.values(condition_interfaces_1.Condition),
    },
    mechanicalCondition: {
        type: [String],
        required: false,
        enum: Object.values(condition_interfaces_1.Condition),
    },
    color: {
        type: String,
        required: false,
    },
    make: {
        type: String,
        required: false,
    },
    model: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
});
// Add plugin to converts mongoose documents to json
searchCriteriaSchema.plugin(toJson_1.default);
/**
 * A pre-save hook to apply additional validation logic to the SearchCriteria
 * document before saving it to the database.
 */
searchCriteriaSchema.pre('validate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchExists = yield search_model_1.default.exists({ _id: this.search });
        if (!searchExists) {
            next(new Error('Search does not exist'));
        }
        next();
    });
});
const SearchCriteria = (0, mongoose_1.model)('SearchCriteria', searchCriteriaSchema);
exports.default = SearchCriteria;
