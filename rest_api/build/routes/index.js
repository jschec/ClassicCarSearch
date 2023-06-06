"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const car_listing_1 = __importDefault(require("./car-listing"));
const car_seller_1 = __importDefault(require("./car-seller"));
const car_1 = __importDefault(require("./car"));
const search_forecast_1 = __importDefault(require("./search-forecast"));
const search_1 = __importDefault(require("./search"));
const subscription_1 = __importDefault(require("./subscription"));
const user_1 = __importDefault(require("./user"));
const watch_list_1 = __importDefault(require("./watch-list"));
const router = express_1.default.Router();
// Definition of route collections
const routeCollections = [
    {
        prefix: "/auth",
        routes: auth_1.default
    },
    {
        prefix: "/car-listings",
        routes: car_listing_1.default
    },
    {
        prefix: "/cars",
        routes: car_1.default
    },
    {
        prefix: "/car-sellers",
        routes: car_seller_1.default
    },
    {
        prefix: "/search-forecasts",
        routes: search_forecast_1.default
    },
    {
        prefix: "/searches",
        routes: search_1.default
    },
    {
        prefix: "/subscriptions",
        routes: subscription_1.default
    },
    {
        prefix: "/users",
        routes: user_1.default
    },
    {
        prefix: "/watch-lists",
        routes: watch_list_1.default
    }
];
// Add collections of routes to the express application router
routeCollections.forEach((routeCollection) => {
    router.use(routeCollection.prefix, routeCollection.routes);
});
exports.default = router;
