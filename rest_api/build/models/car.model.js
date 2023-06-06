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
const car_listing_model_1 = __importDefault(require("./car-listing.model"));
const toJson_1 = __importDefault(require("../utils/toJson"));
const carSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.UUID,
        default: () => (0, crypto_1.randomUUID)(),
    },
    make: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: 1885,
        max: new Date().getFullYear() + 1 // Can't be newer than next year,
    },
    exteriorCondition: {
        type: String,
        required: true,
        enum: Object.values(condition_interfaces_1.Condition)
    },
    mechanicalCondition: {
        type: String,
        required: true,
        enum: Object.values(condition_interfaces_1.Condition)
    },
    mileage: {
        type: Number,
        required: true,
        min: 0,
        max: 1000000 // 1 million miles
    },
    color: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: false,
    },
    forecast: {
        type: mongoose_1.Schema.Types.UUID,
        required: false,
        ref: 'SearchForecast',
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
});
// Add plugin to converts mongoose documents to json
carSchema.plugin(toJson_1.default);
/**
 * A pre deleteOne hook to delete all CarListing documents associated with
 * the Car document being deleted.
 */
carSchema.pre("deleteOne", { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield car_listing_model_1.default.deleteMany({ carId: this._id });
        next();
    });
});
const Car = (0, mongoose_1.model)('Car', carSchema);
exports.default = Car;
