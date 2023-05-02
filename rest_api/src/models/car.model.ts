import { Schema, model } from 'mongoose';

import { Condition } from '../interfaces/condition.interfaces';
import { ICarDoc, ICarModel } from '../interfaces/car.interfaces';
import CarListing from './car-listing.model';

const carSchema = new Schema<ICarDoc, ICarModel>(
  {
    make: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true,
      min: 1885, // First car was invented in 1885
      max: new Date().getFullYear() + 1 // Can't be newer than next year,
    },
    exteriorCondition: {
      type: String,
      required: true,
      enum: Object.values(Condition)
    },
    mechanicalCondition: {
      type: String,
      required: true,
      enum: Object.values(Condition)
    },
    mileage: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000 // 1 million miles
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Car = model<ICarDoc, ICarModel>('Car', carSchema);

/**
 * A pre deleteOne hook to delete all CarListing documents associated with
 * the Car document being deleted.
 */
carSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  const doc = await this.findOne(this.getFilter());

  await CarListing.deleteMany({ carId: doc._id });

  next();
});

export default Car;