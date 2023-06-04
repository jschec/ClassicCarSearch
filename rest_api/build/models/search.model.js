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
const car_listing_model_1 = __importDefault(require("./car-listing.model"));
const search_criteria_model_1 = __importDefault(require("./search-criteria.model"));
const search_forecast_model_1 = __importDefault(require("./search-forecast.model"));
const searchSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.UUID,
        default: () => (0, crypto_1.randomUUID)(),
    },
    results: [{
            type: mongoose_1.Schema.Types.UUID,
            required: false,
            ref: 'CarListing',
        }]
}, {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
});
// Add plugin to converts mongoose documents to json
searchSchema.virtual('criteria', {
    ref: 'SearchCriteria',
    localField: '_id',
    foreignField: 'search',
    justOne: true
});
/**
 * A pre-save hook to apply additional validation logic to the CarListing
 * document before saving it to the database.
 */
searchSchema.pre('validate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let resultIds = [];
        this.results.forEach(item => {
            resultIds.push(item);
        });
        const resultCount = yield car_listing_model_1.default.countDocuments({ _id: { $in: resultIds } });
        if (resultCount !== this.results.length) {
            next(new Error('One or more results do not exist'));
        }
        next();
    });
});
/**
 * A pre deleteOne hook to delete all SearchCriteria and SearchForecast
 * documents associated with the Search document being deleted.
 */
searchSchema.pre("deleteOne", { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield search_criteria_model_1.default.deleteOne({ searchId: this._id });
        yield search_forecast_model_1.default.deleteMany({ searchId: this._id });
        next();
    });
});
const Search = (0, mongoose_1.model)('Search', searchSchema);
exports.default = Search;
