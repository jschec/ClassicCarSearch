"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscription_controller_1 = require("../controllers/subscription.controller");
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => (0, subscription_controller_1.getSubscriptions)(req, res, next));
router.post("/", (req, res, next) => (0, subscription_controller_1.createSubscription)(req, res, next));
router.get("/:subscriptionId", (req, res, next) => (0, subscription_controller_1.getSubscription)(req, res, next));
router.put("/:subscriptionId", (req, res, next) => (0, subscription_controller_1.updateSubscription)(req, res, next));
router.delete("/:subscriptionId", (req, res, next) => (0, subscription_controller_1.deleteSubscription)(req, res, next));
exports.default = router;