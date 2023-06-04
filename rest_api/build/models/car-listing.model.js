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
const region_interfaces_1 = require("../interfaces/region.interfaces");
const car_seller_model_1 = __importDefault(require("./car-seller.model"));
const car_model_1 = __importDefault(require("./car.model"));
const toJson_1 = __importDefault(require("../utils/toJson"));
const carListingSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.UUID,
        default: () => (0, crypto_1.randomUUID)(),
    },
    region: {
        type: String,
        required: true,
        enum: Object.values(region_interfaces_1.Region),
    },
    price: {
        type: Number,
        required: true,
    },
    listDate: {
        type: Date,
        required: true,
        min: new Date('1885-01-01'),
        max: new Date(), // Can't be newer than today
    },
    saleDate: {
        type: Date,
        required: false,
        max: new Date(), // Can't be newer than today
    },
    seller: {
        type: mongoose_1.Schema.Types.UUID,
        required: true,
        ref: 'CarSeller',
    },
    car: {
        type: mongoose_1.Schema.Types.UUID,
        required: true,
        ref: 'Car',
    }
}, {
    timestamps: true,
    toJSON: { getters: true }
});
// Add plugin to convert mongoose documents to json
carListingSchema.plugin(toJson_1.default);
/**
 * A pre-save hook to apply additional validation logic to the CarListing
 * document before saving it to the database.
 */
carListingSchema.pre('validate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const carSellerExists = yield car_seller_model_1.default.exists({ _id: this.seller });
        const carExists = yield car_model_1.default.exists({ _id: this.car });
        let validationMessages = [];
        // Section of validation checks
        if (this.saleDate && (this.listDate > this.saleDate)) {
            validationMessages.push('Sale date must be greater than listing date');
        }
        if (!carSellerExists) {
            validationMessages.push('Car seller does not exist');
        }
        if (!carExists) {
            validationMessages.push('Car does not exist');
        }
        // Return validation errors if any
        if (validationMessages.length > 0) {
            next(new Error(validationMessages.join(', ')));
        }
        next();
    });
});
const CarListing = (0, mongoose_1.model)('CarListing', carListingSchema);
exports.default = CarListing;
