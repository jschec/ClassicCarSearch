import dotenv from 'dotenv';
import mongoose, { Types } from 'mongoose';
import path from 'path';
import fs from 'fs';

// Import env variables
dotenv.config({ debug: true, path: path.join(__dirname, '..', '..', '.env') });

import config from '../config';

import CarListing from '../model/car-listing.model';
import CarSeller from '../model/car-seller.model';
import Car from '../model/car.model';

/**
 * Export all data from the MongoDB database to JSON files
 */
const exportAll = async () => {
    const removeFields = '-createdAt -updatedAt -__v';

    // cars, sellers, carlistings
    const cars = await Car.find({}, removeFields).lean();
    let json = JSON.stringify(cars, null, 4);
    await fs.promises.writeFile('data/cars.json', json);

    const sellers = await CarSeller.find({}, removeFields).lean();
    json = JSON.stringify(sellers, null, 4);
    await fs.promises.writeFile('data/sellers.json', json);

    const carListings = await CarListing.find({}, removeFields).lean();
    json = JSON.stringify(carListings, null, 4);
    await fs.promises.writeFile('data/carlistings.json', json);
};

/**
 * Delete all documents from all collections in the database.
*/
const deleteAll = async () => {
    // delete all data
    await Car.deleteMany({});
    await CarSeller.deleteMany({});
    await CarListing.deleteMany({});
};

//////////////////////////////////////////////////////
// Entry point for the population script
//
// Usage: npm run populate [-from-json]
//////////////////////////////////////////////////////

mongoose.connect(config.mongo.url).then(() => {
    console.log('Connected to MongoDB');

    // let fromJson: boolean;
    // if (process.argv[2] && process.argv[2] === '-from-json') {
    //     console.log('Replicating database from JSON files...');
    //     fromJson = true;
    // } else {
    //     console.log('Creating synthetic data...');
    //     fromJson = false;
    // }

    exportAll().then(() => {
        console.log('Database exported');
        process.exit(0);
    });
});