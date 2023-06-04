"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const config_1 = __importDefault(require("../config"));
const router = (0, express_1.Router)();
router.get('/google', passport_1.default.authenticate('google', { scope: config_1.default.oauth.scope }));
router.get('/google/callback', passport_1.default.authenticate('google', {
    successRedirect: config_1.default.routes.landingUrl,
    failureRedirect: config_1.default.routes.loginUrl,
}));
router.get("/session", (req, res) => {
    let userCopy = Object.assign({}, req.user);
    // Remove sensitive data
    delete userCopy.ssoID;
    res.send({ user: req.user, isAuthenticated: req.isAuthenticated() });
});
router.delete("/session", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    });
    // Required, otherwise error will be thrown
    if (res.headersSent !== true) {
        res.send({ success: true });
    }
});
exports.default = router;
