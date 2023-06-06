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
const user_model_1 = __importDefault(require("./user.model"));
const toJson_1 = __importDefault(require("../utils/toJson"));
const watchListSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.UUID,
        default: () => (0, crypto_1.randomUUID)(),
    },
    user: {
        type: mongoose_1.Schema.Types.UUID,
        required: true,
        ref: 'User'
    },
    searches: [{
            type: mongoose_1.Schema.Types.UUID,
            required: false,
            ref: 'Search'
        }]
}, {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
});
// Add plugin to converts mongoose documents to json
watchListSchema.plugin(toJson_1.default);
/**
 * A pre-save hook to apply additional validation logic to the User
 * document before saving it to the database.
 */
watchListSchema.pre('validate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userExists = yield user_model_1.default.exists({ _id: this.user });
        if (!userExists) {
            next(new Error('User does not exist'));
        }
        next();
    });
});
const WatchList = (0, mongoose_1.model)('WatchList', watchListSchema);
exports.default = WatchList;
