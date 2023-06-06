"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth_1 = require("passport-google-oauth");
const config_1 = __importDefault(require("../config"));
const user_model_1 = __importDefault(require("../models/user.model"));
passport_1.default.serializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
passport_1.default.use(new passport_google_oauth_1.OAuth2Strategy({
    clientID: config_1.default.oauth.clientId,
    clientSecret: config_1.default.oauth.clientSecret,
    callbackURL: config_1.default.oauth.callbackUrl,
    passReqToCallback: true
}, function (request, accessToken, refreshToken, profile, done) {
    var _a, _b;
    let refUser = {
        ssoID: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value,
        pictureUri: (_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value,
        age: -1,
    };
    user_model_1.default.findOrCreate(refUser).then((user) => {
        return done(null, user);
    });
}));
