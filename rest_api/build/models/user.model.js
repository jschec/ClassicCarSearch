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
const watch_list_model_1 = __importDefault(require("./watch-list.model"));
const subscription_model_1 = __importDefault(require("./subscription.model"));
const toJson_1 = __importDefault(require("../utils/toJson"));
const userSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.UUID,
        default: () => (0, crypto_1.randomUUID)(),
    },
    ssoID: {
        type: String,
        required: true,
        unique: true
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
    },
    pictureUri: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
    },
    subscription: {
        type: mongoose_1.Schema.Types.UUID,
        required: false,
        ref: 'Subscription',
    },
    watchList: {
        type: mongoose_1.Schema.Types.UUID,
        required: false,
        ref: 'WatchList',
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
});
// Add plugin to converts mongoose documents to json
userSchema.plugin(toJson_1.default);
/**
 * Check if the email associated with the user is already associated with
 * another user
 *
 * @param {string} email  The email to be checked
 * @param {ObjectId} [excludeUserId]  The id of the user to be excluded
 * @returns {Promise<boolean>} Promise indicating if the email is taken or not
 */
userSchema.static('isEmailTaken', function (email, excludeUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ email, _id: { $ne: excludeUserId } });
        return !!user;
    });
});
/**
 * Check if the user already exists in the database. If not, create a new user.
 *
 * @param {NewUserBody} refUser  The user to be checked
 * @returns {Promise<IUserDoc>} Promise containing the user document
 */
userSchema.static('findOrCreate', function (refUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield this.findOne({ ssoID: refUser.ssoID });
        if (!user) {
            const newUser = yield this.create(refUser);
            // Create a new WatchList document for the new user
            const userWatchList = yield watch_list_model_1.default.create({ user: newUser._id });
            // Update the new user with the new WatchList document
            newUser.watchList = userWatchList._id;
            yield newUser.save();
            return newUser;
        }
        return user;
    });
});
/**
 * A pre deleteOne hook to delete the WatchList document associated with the
 * Search document being deleted.
 */
userSchema.pre("deleteOne", { document: true, query: false }, function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield watch_list_model_1.default.deleteOne({ _id: this.watchList });
        next();
    });
});
/**
 * A pre-save hook to apply additional validation logic to the User
 * document before saving it to the database.
 */
userSchema.pre('validate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.subscription) {
            const subscriptionExists = yield subscription_model_1.default.exists({ _id: this.subscription });
            if (!subscriptionExists) {
                next(new Error('Subscription does not exist'));
            }
        }
        if (this.watchList) {
            const watchListExists = yield watch_list_model_1.default.exists({ _id: this.watchList });
            if (!watchListExists) {
                next(new Error('WatchList does not exist'));
            }
        }
        next();
    });
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
