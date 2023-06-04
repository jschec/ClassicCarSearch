"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const mongoose_1 = require("mongoose");
const toJson_1 = __importDefault(require("../utils/toJson"));
const searchForecastSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.UUID,
        default: () => (0, crypto_1.randomUUID)(),
    },
    avgTimeOnMarket: {
        type: Number,
        required: true,
        min: 0,
        max: 36500 // 100 years
    },
    avgPrice: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000 // 1 million miles
    },
    averageMileage: {
        type: Number,
        required: true,
        min: 0,
        max: 100000000 // 100 million
    },
    ttl: {
        type: Number,
        required: true,
    },
    priceHistory: {
        type: [Number],
        required: false,
    },
    forecastRegion: {
        type: String,
        required: false
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
});
// Add plugin to converts mongoose documents to json
searchForecastSchema.plugin(toJson_1.default);
//TODO 6/2 - Should this be removed?
/**
 * A pre-save hook to apply additional validation logic to the SearchForecast
 * document before saving it to the database.
 */
/* searchForecastSchema.pre('validate', async function(next) {
  const carExists = await Car.exists({ _id: this.search });

  if (!carExists) {
    next(new Error('Car for forecast does not exist'));
  }

  next();
}); */
const SearchForecast = (0, mongoose_1.model)('SearchForecast', searchForecastSchema);
exports.default = SearchForecast;
