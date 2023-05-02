import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import path from 'path';
import { faker } from '@faker-js/faker';
import cliProgress from 'cli-progress';

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
      cost: 0
    },
    {
      name: 'Basic',
      cost: 10
    },
    {
      name: 'Premium',
      cost: 20
    },
    {
      name: 'Enterprise',
      cost: 100
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
  const pbar = createPBar(100);

  for (let i = 0; i < 100; i++) {
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

  let carIds: Types.ObjectId[] = [];
  let carSellerIds: Types.ObjectId[] = [];

  // Create a progress bar to track the progress
  const carPbar = createPBar(10000);

  // Generate 10,000 random cars
  for (let i = 0; i < 10000; i++) {
    const car: NewCarBody = {
      make: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      year: faker.datatype.number({min: 1980, max: 2020}),
      exteriorCondition: randomCondition(),
      mechanicalCondition: randomCondition(),
      mileage: faker.datatype.number({min: 0, max: 200000}),
      color: faker.vehicle.color(),
    };

    const carRecord = await Car.create(car);
    carIds.push(carRecord._id);
    carPbar.update(i + 1);
  };

  carPbar.stop();

  console.log("Populating car sellers...");

  // Create a progress bar to track the progress
  const carSellerPbar = createPBar(1000);

  // Generate 1,000 random car sellers
  for (let i = 0; i < 1000; i++) {
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
  const carListingPbar = createPBar(10000);

  // Assign each car to a listing
  for (let i = 0; i < carIds.length; i++) {
    const carSellerId = randomArrayElement<Types.ObjectId>(carSellerIds);

    const carListing: NewCarListingBody = {
      region: randomRegion(),
      price: faker.datatype.number({min: 1000, max: 100000}),
      listDate: faker.date.past(3),
      saleDate: null,
      car: carIds[i],
      seller: carSellerId as Types.ObjectId
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
  const pbar = createPBar(1000);

  for (let i = 0; i < 1000; i++) {
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
    for (let j = 0; j < 10; j++) {
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
    let selectedSearches: Types.ObjectId[] = [];

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
 * Populates the database with dummy data
 */
const populateDatabase = async () => {
  await populateSubscriptions();
  await populateUsers();
  await populateCarListings();
  await populateSearches();
  await populateWatchLists();
};

// Entry point for the population script
mongoose.connect(config.mongo.url).then(() => {
  console.log('Connected to MongoDB');
  
  populateDatabase().then(() => {
    console.log('Database populated');
    process.exit(0);
  });
});