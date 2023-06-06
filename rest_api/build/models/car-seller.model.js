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
const validator_1 = __importDefault(require("validator"));
const car_listing_model_1 = __importDefault(require("./car-listing.model"));
const toJson_1 = __importDefault(require("../utils/toJson"));
const carSellerSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.UUID,
        default: () => (0, crypto_1.randomUUID)(),
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
});
// Add plugin to convert mongoose documents to json
carSellerSchema.plugin(toJson_1.default);
/**
 * Check if the email associated with the CarSeller is already associated with
 * another CarSeller
 *
 * @param {string} email  The email to be checked
 * @param {ObjectId} [excludeCarSellerId]  The id of the CarSeller to be excluded
 * @returns {Promise<boolean>} Promise indicating if the email is taken or not
 */
carSellerSchema.static('isEmailTaken', function (email, excludeCarSellerId) {
    return __awaiter(this, void 0, void 0, function* () {
        const carSeller = yield this.findOne({ email, _id: { $ne: excludeCarSellerId } });
        return !!carSeller;
    });
});
/**
 * A pre deleteOne hook to delete all CarListings documents associated with
 * the CarSeller document being deleted.
 */
carSellerSchema.pre("deleteOne", { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield car_listing_model_1.default.deleteMany({ sellerId: this._id });
        next();
    });
});
const CarSeller = (0, mongoose_1.model)('CarSeller', carSellerSchema);
exports.default = CarSeller;
