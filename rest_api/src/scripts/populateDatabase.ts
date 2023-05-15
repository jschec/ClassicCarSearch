import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import path from 'path';
import { faker } from '@faker-js/faker';
import cliProgress from 'cli-progress';
import fs from 'fs';

// Import env variables
dotenv.config({ debug: true, path: path.join(__dirname, '..', '..', '.env') });

import config from '../config';

import { Condition } from '../interfaces/condition.interfaces';
import { Region } from '../interfaces/region.interfaces';

import { NewCarBody } from '../interfaces/car.interfaces';
import { NewCarListingBody } from '../interfaces/car-listing.interfaces';
import { NewCarSellerBody } from '../interfaces/car-seller.interfaces';
import { SearchCriteriaRequest } from '../interfaces/search-criteria.interfaces';
import { NewSearchForecastBody } from '../interfaces/search-forecast.interfaces';
import { NewSubscriptionBody } from '../interfaces/subscription.interfaces';
import { NewUserBody, UpdateUserBody } from '../interfaces/user.interfaces';
import { NewWatchListBody } from '../interfaces/watch-list.interfaces';

import CarListing from '../models/car-listing.model';
import CarSeller from '../models/car-seller.model';
import Car from '../models/car.model';
import Search from '../models/search.model';
import Subscription from '../models/subscription.model';
import User from '../models/user.model';
import WatchList from '../models/watch-list.model';

import * as carListingService from '../services/car-listing.service';
import * as searchCriteriaService from '../services/search-criteria.service';
import * as searchForecastService from '../services/search-forecast.service';
import * as searchService from '../services/search.service';
import SearchForecast from '../models/search-forecast.model';

/**
 * Creates the specified progress bar
 *
 * @param {number} total The size of the progress bar
 * @returns {SingleBar} The created progress bar
 */
const createPBar = (total: number) => {
  const pbar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

  pbar.start(total, 0);

  return pbar;
}

/**
 * Selects a random Condition enum value
 *
 * @returns {Condition} a random condition from the Condition enum
 */
const randomCondition = () => {
  const conditions: string[] = Object.values(Condition);
  const randCondition = conditions[faker.datatype.number({min: 0, max: conditions.length - 1})] as Condition;

  return randCondition;
};

/**
 * Selects a random Region enum value
 *
 * @returns {Region} a random region from the Region enum
 */
const randomRegion = () => {
  const regions: string[] = Object.values(Region);
  const randRegion = regions[faker.datatype.number({min: 0, max: regions.length - 1})] as Region;

  return randRegion;
};

/**
 * Selects a random element from the given array
 *
 * @param {T} array The array to select from
 * @returns {T} A random element from the given array
 */
const randomArrayElement = <T=any>(array: T[]) : T => {
  return array[faker.datatype.number({min: 0, max: array.length - 1})];
}

/**
 * Populates the Subscription collection with the default subscription levels
 */
const populateSubscriptions = async () => {
  console.log("Populating subscriptions...");

  const subscriptionLevels: NewSubscriptionBody[] = [
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
    if (!await Subscription.isNameTaken(subscriptionLevels[i].name)) {
      await Subscription.create(subscriptionLevels[i]);
    }
    pbar.update(i + 1);
  }
};

/**
 * Populates the User collection with dummy data
 */
const populateUsers = async () => {
  console.log("Populating users...");

  const subscriptionLevels = await Subscription.find();

  // Create a progress bar to track the progress
  const pbar = createPBar(5);

  for (let i = 0; i < 5; i++) {
    const user: NewUserBody = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      pictureUri: faker.image.avatar(),
      age: faker.datatype.number({min: 18, max: 100}),
    };
    const userRecord = await User.create(user);

    const updateData: UpdateUserBody = {
      subscription: randomArrayElement(subscriptionLevels)._id
    };

    Object.assign(userRecord, updateData);
    await userRecord.save();

    pbar.update(i + 1);
  };

  pbar.stop();
};

/**
 * Populates the Cars, CarSellers, and CarListings collections with dummy data
 */
const populateCarListings = async () => {
  console.log("Populating cars...");

  let carIds: string[] = [];
  let carSellerIds: string[] = [];

  // Create a progress bar to track the progress
  const carPbar = createPBar(50);

  // get all car images
  const carImages = JSON.parse(fs.readFileSync('data/carimgs.json', 'utf-8'));

  // Generate 10,000 random cars
  for (let i = 0; i < 50; i++) {
    const car: NewCarBody = {
      make: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      year: faker.datatype.number({min: 1980, max: 2020}),
      exteriorCondition: randomCondition(),
      mechanicalCondition: randomCondition(),
      mileage: faker.datatype.number({min: 0, max: 200000}),
      color: faker.vehicle.color(),
      img: carImages[Math.floor(Math.random() * carImages.length)],
    };

    const carRecord = await Car.create(car);
    carIds.push(carRecord._id);
    carPbar.update(i + 1);
  };

  carPbar.stop();

  console.log("Populating car sellers...");

  // Create a progress bar to track the progress
  const carSellerPbar = createPBar(3);

  // Generate 1,000 random car sellers
  for (let i = 0; i < 3; i++) {
    const carSeller: NewCarSellerBody = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email()
    };

    const carSellerRecord = await CarSeller.create(carSeller);
    carSellerIds.push(carSellerRecord._id);

    carSellerPbar.update(i + 1);
  };

  carSellerPbar.stop();

  console.log("Populating car listings...");

  // Create a progress bar to track the progress
  const carListingPbar = createPBar(carIds.length);

  // Assign each car to a listing
  for (let i = 0; i < carIds.length; i++) {
    const carSellerId = randomArrayElement<string>(carSellerIds);

    const carListing: NewCarListingBody = {
      region: randomRegion(),
      price: faker.datatype.number({min: 1000, max: 100000}),
      listDate: faker.date.past(3),
      saleDate: null,
      car: carIds[i],
      seller: carSellerId
    };

    await CarListing.create(carListing);
    carListingPbar.update(i + 1);
  }

  carListingPbar.stop();
};

/**
 * Populates the Searches, SearchCriteria, and SearchResults collections with
 * dummy data.
 */
const populateSearches = async () => {
  console.log("Populating searches...");

  // Create a progress bar to track the progress
  const pbar = createPBar(30);

  for (let i = 0; i < 30; i++) {
    const searchCriteria: SearchCriteriaRequest = {
      region: randomRegion()
    };

    const matchingListings = await carListingService.applyQuery(
      searchCriteria
    );
    const listingIds = matchingListings.map(listing => listing._id);

    const record = await searchService.create({
      ...searchCriteria, results: listingIds
    });

    // Create the SearchCriteria record
    await searchCriteriaService.create({
      ...searchCriteria, search: record._id
    });

    // Create 10 SearchForecast records for each Search record
    for (let j = 0; j < 1; j++) {
      const searchForecast: NewSearchForecastBody = {
        search: record._id,
        avgTimeOnMarket: faker.datatype.number({min: 1, max: 1000}),
        avgPrice: faker.datatype.number({min: 1000, max: 100000}),
        averageMileage: faker.datatype.number({min: 0, max: 200000}),
        ttl: 300,
      };

      await searchForecastService.create(searchForecast);
    }

    pbar.update(i + 1);
  };

  pbar.stop();
};

/**
 * Populates the WatchList collection with dummy data
 */
const populateWatchLists = async () => {
  console.log("Populating watch lists...");

  const users = await User.find();
  const searches = await Search.find();

  const pbar = createPBar(users.length);

  for (let i = 0; i < users.length; i++) {
    let selectedSearches: string[] = [];

    // Select 10 random searches
    for (let i = 0; i < 10; i++) {
      selectedSearches.push(randomArrayElement(searches)._id);
    };

    const watchList: NewWatchListBody = {
      user: users[i]._id,
      searches: selectedSearches
    };

    await WatchList.create(watchList);

    pbar.update(i + 1);
  }

  pbar.stop();
}

/**
 * Export all data from the MongoDB database to JSON files
 */
const exportAll = async () => {
  const removeFields = '-createdAt -updatedAt -__v';
  
  // subscriptions
  const subscriptions = await Subscription.find({}, removeFields).lean();
  let json = JSON.stringify(subscriptions, null, 4);
  await fs.promises.writeFile('data/subscriptions.json', json);
  
  // users
  const users = await User.find({}, removeFields).lean();
  json = JSON.stringify(users, null, 4);
  await fs.promises.writeFile('data/users.json', json);
  
  // cars, sellers, carlistings
  const cars = await Car.find({}, removeFields).lean();
  json = JSON.stringify(cars, null, 4);
  await fs.promises.writeFile('data/cars.json', json);
  
  const sellers = await CarSeller.find({}, removeFields).lean();
  json = JSON.stringify(sellers, null, 4);
  await fs.promises.writeFile('data/sellers.json', json);
  
  const carListings = await CarListing.find({}, removeFields).lean();
  json = JSON.stringify(carListings, null, 4);
  await fs.promises.writeFile('data/carlistings.json', json);
  
  // searchs, searchforecast
  const searches = await Search.find({}, removeFields).lean();
  json = JSON.stringify(searches, null, 4);
  await fs.promises.writeFile('data/searches.json', json);
  
  const searchforecasts = await SearchForecast.find({}, removeFields).lean();
  json = JSON.stringify(searchforecasts, null, 4);
  await fs.promises.writeFile('data/searchforecasts.json', json);
  
  // watchlist
  const watchlists = await WatchList.find({}, removeFields).lean();
  json = JSON.stringify(watchlists, null, 4);
  await fs.promises.writeFile('data/watchlists.json', json);
};

/**
 * Delete all documents from all collections in the database.
*/
const deleteAll = async () => {
  // delete all data
  await Subscription.deleteMany({});
  await User.deleteMany({});
  await Car.deleteMany({});
  await CarSeller.deleteMany({});
  await CarListing.deleteMany({});
  await Search.deleteMany({});
  await SearchForecast.deleteMany({});
  await WatchList.deleteMany({});
};

/**
 * Imports data from JSON files into the MongoDB database using Mongoose models
 * Deletes all data from the database before importing
*/
const importAll = async () => {
  // import from json
  const subscriptions = JSON.parse(fs.readFileSync('data/subscriptions.json', 'utf8'));
  await Subscription.insertMany(subscriptions);

  const users = JSON.parse(fs.readFileSync('data/users.json', 'utf8'));
  await User.insertMany(users);
  
  const cars = JSON.parse(fs.readFileSync('data/cars.json', 'utf8'));
  await Car.insertMany(cars);
  
  const sellers = JSON.parse(fs.readFileSync('data/sellers.json', 'utf8'));
  await CarSeller.insertMany(sellers);
  
  const carListings = JSON.parse(fs.readFileSync('data/carlistings.json', 'utf8'));
  await CarListing.insertMany(carListings);
  
  const searches = JSON.parse(fs.readFileSync('data/searches.json', 'utf8'));
  await Search.insertMany(searches);
  
  const searchforecasts = JSON.parse(fs.readFileSync('data/searchforecasts.json', 'utf8'));
  await SearchForecast.insertMany(searchforecasts);
  
  const watchlists = JSON.parse(fs.readFileSync('data/watchlists.json', 'utf8'));
  await WatchList.insertMany(watchlists);
};

/**
 * Populates the database with dummy data
 */
const populateDatabase = async (fromJson: boolean) => {
  await deleteAll();

  if (fromJson) {
    // Import all data from JSON files.
    await importAll();
  } else {
    // Create synthetic data.
    await populateSubscriptions();
    await populateUsers();
    await populateCarListings();
    await populateSearches();
    await populateWatchLists();
    await exportAll();
  }
};


//////////////////////////////////////////////////////
// Entry point for the population script
//
// Usage: npm run populate [-from-json]
//////////////////////////////////////////////////////

mongoose.connect(config.mongo.url).then(() => {
  console.log('Connected to MongoDB');

  let fromJson: boolean;

  if (process.argv[2] && process.argv[2] === '-from-json') {
    console.log('Replicating database from JSON files...');
    fromJson = true;
  } else {
    console.log('Creating synthetic data...');
    fromJson = false;
  }

  populateDatabase(fromJson).then(() => {
    console.log('Database populated');
    process.exit(0);
  });
});