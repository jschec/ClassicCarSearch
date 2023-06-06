"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const faker_1 = require("@faker-js/faker");
const cli_progress_1 = __importDefault(require("cli-progress"));
const fs_1 = __importDefault(require("fs"));
// Import env variables
dotenv_1.default.config({ debug: true, path: path_1.default.join(__dirname, '..', '..', '.env') });
const config_1 = __importDefault(require("../config"));
const condition_interfaces_1 = require("../interfaces/condition.interfaces");
const region_interfaces_1 = require("../interfaces/region.interfaces");
const car_listing_model_1 = __importDefault(require("../models/car-listing.model"));
const car_seller_model_1 = __importDefault(require("../models/car-seller.model"));
const car_model_1 = __importDefault(require("../models/car.model"));
const search_model_1 = __importDefault(require("../models/search.model"));
const subscription_model_1 = __importDefault(require("../models/subscription.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const watch_list_model_1 = __importDefault(require("../models/watch-list.model"));
const search_forecast_model_1 = __importDefault(require("../models/search-forecast.model"));
const carListingService = __importStar(require("../services/car-listing.service"));
const searchCriteriaService = __importStar(require("../services/search-criteria.service"));
const searchService = __importStar(require("../services/search.service"));
const search_forecast_model_2 = __importDefault(require("../models/search-forecast.model"));
/**
 * Creates the specified progress bar
 *
 * @param {number} total The size of the progress bar
 * @returns {SingleBar} The created progress bar
 */
const createPBar = (total) => {
    const pbar = new cli_progress_1.default.SingleBar({}, cli_progress_1.default.Presets.shades_classic);
    pbar.start(total, 0);
    return pbar;
};
/**
 * Selects a random Condition enum value
 *
 * @returns {Condition} a random condition from the Condition enum
 */
const randomCondition = () => {
    const conditions = Object.values(condition_interfaces_1.Condition);
    const randCondition = conditions[faker_1.faker.datatype.number({ min: 0, max: conditions.length - 1 })];
    return randCondition;
};
/**
 * Selects a random Region enum value
 *
 * @returns {Region} a random region from the Region enum
 */
const randomRegion = () => {
    const regions = Object.values(region_interfaces_1.Region);
    const randRegion = regions[faker_1.faker.datatype.number({ min: 0, max: regions.length - 1 })];
    return randRegion;
};
/**
 * Selects a random element from the given array
 *
 * @param {T} array The array to select from
 * @returns {T} A random element from the given array
 */
const randomArrayElement = (array) => {
    return array[faker_1.faker.datatype.number({ min: 0, max: array.length - 1 })];
};
/**
 * Populates the Subscription collection with the default subscription levels
 */
const populateSubscriptions = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Populating subscriptions...");
    const subscriptionLevels = [
        {
            name: 'Free',
            cost: 0,
            features: [
                "20 searches per day",
                "Displayed advertisements"
            ]
        },
        {
            name: 'Basic',
            cost: 10,
            features: [
                "Unlimited searches",
                "Ability to save and manage searches",
                "No advertisements"
            ]
        },
        {
            name: 'Premium',
            cost: 20,
            features: [
                "Access to market research data",
                "Access to limited data API",
                "Limit to 100 API calls per minute"
            ]
        },
        {
            name: 'Enterprise',
            cost: 100,
            features: [
                "Access to expanded data API",
                "Limit to 10,000 API calls per minute",
                "Technical support"
            ]
        },
    ];
    // Create a progress bar to track the progress
    const pbar = createPBar(subscriptionLevels.length);
    // Add each subscription level to the database if it doesn't already exist
    for (let i = 0; i < subscriptionLevels.length; i++) {
        if (!(yield subscription_model_1.default.isNameTaken(subscriptionLevels[i].name))) {
            yield subscription_model_1.default.create(subscriptionLevels[i]);
        }
        pbar.update(i + 1);
    }
});
/**
 * Populates the User collection with dummy data
 */
const populateUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Populating users...");
    const subscriptionLevels = yield subscription_model_1.default.find();
    // Create a progress bar to track the progress
    const pbar = createPBar(5);
    for (let i = 0; i < 5; i++) {
        const user = {
            ssoID: faker_1.faker.datatype.uuid(),
            firstName: faker_1.faker.name.firstName(),
            lastName: faker_1.faker.name.lastName(),
            email: faker_1.faker.internet.email(),
            pictureUri: faker_1.faker.image.avatar(),
        };
        const userRecord = yield user_model_1.default.create(user);
        const updateData = {
            subscription: randomArrayElement(subscriptionLevels)._id
        };
        Object.assign(userRecord, updateData);
        yield userRecord.save();
        pbar.update(i + 1);
    }
    ;
    pbar.stop();
});
/**
 * Populates the Cars, CarSellers, and CarListings collections with dummy data
 * Set CAR_COUNT to decide how many listings to generate
 */
const populateCarListings = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Populating cars...");
    let carIds = [];
    let carListingIds = [];
    // get all cars
    const cars = JSON.parse(fs_1.default.readFileSync('../data_provider/data/extracted_color_cars.json', 'utf-8'));
    const carListings = JSON.parse(fs_1.default.readFileSync('../data_provider/data/carlistings.json', 'utf-8'));
    const carSellers = JSON.parse(fs_1.default.readFileSync('../data_provider/data/sellers.json', 'utf-8'));
    // Create a progress bar to track the progress
    const carPbar = createPBar(carListings.length);
    // Generate 'CAR_COUNT' random cars
    for (let i = 0; i < carListings.length; i++) {
        let currListing = carListings[i];
        let currCar = cars.find((car) => car._id === currListing.car);
        if (!currCar) {
            continue;
        }
        let car = {
            make: currCar["make"],
            model: currCar["model"],
            year: currCar["year"],
            exteriorCondition: currCar["exteriorCondition"],
            mechanicalCondition: currCar["mechanicalCondition"],
            mileage: currCar["mileage"],
            color: currCar["color"],
            img: currCar["img"],
            forecast: '',
        };
        // Parameters for generating forecasts
        const HISTORY_LENGTH = 12;
        const PRICE_MIN = currListing["price"];
        const PRICE_MAX = currListing["price"] * 2.5;
        // Create forecast
        const forecast = {
            avgTimeOnMarket: faker_1.faker.datatype.number({ min: 1, max: 1000 }),
            avgPrice: faker_1.faker.datatype.number({ min: 1000, max: 100000 }),
            averageMileage: faker_1.faker.datatype.number({ min: 0, max: 200000 }),
            ttl: 300,
            priceHistory: [],
            forecastRegion: randomRegion(),
        };
        // Fill price history array
        for (let j = 0; j < HISTORY_LENGTH; j++) {
            (_a = forecast.priceHistory) === null || _a === void 0 ? void 0 : _a.push(faker_1.faker.datatype.number({ min: PRICE_MIN, max: PRICE_MAX }));
        }
        //Create and assign forecast to car    
        const myForecast = yield search_forecast_model_1.default.create(forecast);
        car.forecast = myForecast._id;
        // Create car
        const carRecord = yield car_model_1.default.create(car);
        // Add new car id and update progress
        carIds.push(carRecord._id);
        carListingIds.push(currListing._id);
        carPbar.update(i + 1);
    }
    ;
    carPbar.stop();
    console.log("Populating car listings...");
    // Create a progress bar to track the progress
    const carListingPbar = createPBar(carIds.length);
    // Assign each car to a listing
    for (let i = 0; i < carIds.length; i++) {
        let currSeller = carSellers.find((seller) => seller._id === carListings[i].seller);
        let currCarListing = carListings[i];
        const carSeller = {
            firstName: currSeller["firstName"],
            lastName: currSeller["lastName"],
            email: currSeller["email"]
        };
        const carSellerRecord = yield car_seller_model_1.default.create(carSeller);
        const carListing = {
            region: currCarListing["region"],
            price: currCarListing["price"],
            listDate: currCarListing["listDate"],
            saleDate: null,
            car: carIds[i],
            seller: carSellerRecord._id
        };
        // Make 1 in 5 listings closed    
        if (i % 5 == 0) {
            carListing.saleDate = faker_1.faker.date.recent();
        }
        yield car_listing_model_1.default.create(carListing);
        carListingPbar.update(i + 1);
    }
    carListingPbar.stop();
});
/**
 * Populates the Searches, SearchCriteria, and SearchResults collections with
 * dummy data.
 */
const populateSearches = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Populating searches...");
    // Create a progress bar to track the progress
    const pbar = createPBar(30);
    for (let i = 0; i < 30; i++) {
        const searchCriteria = {
            region: randomRegion()
        };
        const matchingListings = yield carListingService.applyQuery(Object.assign({ page: 0, pageSize: -1 }, searchCriteria), false);
        const listingIds = matchingListings.records.map(listing => listing._id);
        const record = yield searchService.create(Object.assign(Object.assign({}, searchCriteria), { results: listingIds }));
        // Create the SearchCriteria record
        yield searchCriteriaService.create(Object.assign(Object.assign({}, searchCriteria), { search: record._id }));
        pbar.update(i + 1);
    }
    ;
    pbar.stop();
});
/**
 * Populates the WatchList collection with dummy data
 */
const populateWatchLists = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Populating watch lists...");
    const users = yield user_model_1.default.find();
    const searches = yield search_model_1.default.find();
    const pbar = createPBar(users.length);
    for (let i = 0; i < users.length; i++) {
        let selectedSearches = [];
        // Select 10 random searches
        for (let i = 0; i < 10; i++) {
            selectedSearches.push(randomArrayElement(searches)._id);
        }
        ;
        const watchList = {
            user: users[i]._id,
            searches: selectedSearches
        };
        yield watch_list_model_1.default.create(watchList);
        pbar.update(i + 1);
    }
    pbar.stop();
});
/**
 * Export all data from the MongoDB database to JSON files
 */
const exportAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const removeFields = '-createdAt -updatedAt -__v';
    // subscriptions
    const subscriptions = yield subscription_model_1.default.find({}, removeFields).lean();
    let json = JSON.stringify(subscriptions, null, 4);
    yield fs_1.default.promises.writeFile('data/subscriptions.json', json);
    // users
    const users = yield user_model_1.default.find({}, removeFields).lean();
    json = JSON.stringify(users, null, 4);
    yield fs_1.default.promises.writeFile('data/users.json', json);
    // cars, sellers, carlistings
    const cars = yield car_model_1.default.find({}, removeFields).lean();
    json = JSON.stringify(cars, null, 4);
    yield fs_1.default.promises.writeFile('data/cars.json', json);
    const sellers = yield car_seller_model_1.default.find({}, removeFields).lean();
    json = JSON.stringify(sellers, null, 4);
    yield fs_1.default.promises.writeFile('data/sellers.json', json);
    const carListings = yield car_listing_model_1.default.find({}, removeFields).lean();
    json = JSON.stringify(carListings, null, 4);
    yield fs_1.default.promises.writeFile('data/carlistings.json', json);
    // searchs, searchforecast
    const searches = yield search_model_1.default.find({}, removeFields).lean();
    json = JSON.stringify(searches, null, 4);
    yield fs_1.default.promises.writeFile('data/searches.json', json);
    const searchforecasts = yield search_forecast_model_2.default.find({}, removeFields).lean();
    json = JSON.stringify(searchforecasts, null, 4);
    yield fs_1.default.promises.writeFile('data/searchforecasts.json', json);
    // watchlist
    const watchlists = yield watch_list_model_1.default.find({}, removeFields).lean();
    json = JSON.stringify(watchlists, null, 4);
    yield fs_1.default.promises.writeFile('data/watchlists.json', json);
});
/**
 * Delete all documents from all collections in the database.
*/
const deleteAll = () => __awaiter(void 0, void 0, void 0, function* () {
    // delete all data
    yield subscription_model_1.default.deleteMany({});
    yield user_model_1.default.deleteMany({});
    yield car_model_1.default.deleteMany({});
    yield car_seller_model_1.default.deleteMany({});
    yield car_listing_model_1.default.deleteMany({});
    yield search_model_1.default.deleteMany({});
    yield search_forecast_model_2.default.deleteMany({});
    yield watch_list_model_1.default.deleteMany({});
});
/**
 * Imports data from JSON files into the MongoDB database using Mongoose models
 * Deletes all data from the database before importing
*/
const importAll = () => __awaiter(void 0, void 0, void 0, function* () {
    // import from json
    const subscriptions = JSON.parse(fs_1.default.readFileSync('data/subscriptions.json', 'utf8'));
    yield subscription_model_1.default.insertMany(subscriptions);
    const users = JSON.parse(fs_1.default.readFileSync('data/users.json', 'utf8'));
    yield user_model_1.default.insertMany(users);
    const cars = JSON.parse(fs_1.default.readFileSync('data/cars.json', 'utf8'));
    yield car_model_1.default.insertMany(cars);
    const sellers = JSON.parse(fs_1.default.readFileSync('data/sellers.json', 'utf8'));
    yield car_seller_model_1.default.insertMany(sellers);
    const carListings = JSON.parse(fs_1.default.readFileSync('data/carlistings.json', 'utf8'));
    yield car_listing_model_1.default.insertMany(carListings);
    const searches = JSON.parse(fs_1.default.readFileSync('data/searches.json', 'utf8'));
    yield search_model_1.default.insertMany(searches);
    const searchforecasts = JSON.parse(fs_1.default.readFileSync('data/searchforecasts.json', 'utf8'));
    yield search_forecast_model_2.default.insertMany(searchforecasts);
    const watchlists = JSON.parse(fs_1.default.readFileSync('data/watchlists.json', 'utf8'));
    yield watch_list_model_1.default.insertMany(watchlists);
});
/**
 * Populates the database with dummy data
 */
const populateDatabase = (fromJson) => __awaiter(void 0, void 0, void 0, function* () {
    yield deleteAll();
    if (fromJson) {
        // Import all data from JSON files.
        yield importAll();
    }
    else {
        // Create synthetic data.
        yield populateSubscriptions();
        yield populateUsers();
        yield populateCarListings();
        yield populateSearches();
        yield populateWatchLists();
        yield exportAll();
    }
});
//////////////////////////////////////////////////////
// Entry point for the population script
//
// Usage: npm run populate [-from-json]
//////////////////////////////////////////////////////
mongoose_1.default.connect(config_1.default.mongo.url).then(() => {
    console.log('Connected to MongoDB');
    let fromJson;
    if (process.argv[2] && process.argv[2] === '-from-json') {
        console.log('Replicating database from JSON files...');
        fromJson = true;
    }
    else {
        console.log('Creating synthetic data...');
        fromJson = false;
    }
    populateDatabase(fromJson).then(() => {
        console.log('Database populated');
        process.exit(0);
    });
});
