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
const toJson_1 = __importDefault(require("../utils/toJson"));
const subscriptionSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.UUID,
        default: () => (0, crypto_1.randomUUID)(),
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    features: {
        type: [String],
        required: true,
    },
    cost: {
        type: Number,
        required: true,
        min: 0,
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
});
// Add plugin to converts mongoose documents to json
subscriptionSchema.plugin(toJson_1.default);
/**
 * Check if the name associated with the subscripion is already associated with
 * another subscripion
 *
 * @param {string} name  The name to be checked
 * @param {string} [excludeRecId]  The id of the subscription to be excluded
 * @returns {Promise<boolean>} Promise indicating if the name is taken or not
 */
subscriptionSchema.static('isNameTaken', function (name, excludeRecId) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield this.findOne({ name, _id: { $ne: excludeRecId } });
        return !!record;
    });
});
const Subscription = (0, mongoose_1.model)('Subscription', subscriptionSchema);
exports.default = Subscription;
