import { randomUUID } from 'crypto';
import { Schema, model } from 'mongoose';

import { Condition } from '../interfaces/condition.interfaces';
import { ICarDoc, ICarModel } from '../interfaces/car.interfaces';
import CarListing from './car-listing.model';

const carSchema = new Schema<ICarDoc, ICarModel>(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
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
    img: {
      type: String,
      required: false,
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
carSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  await CarListing.deleteMany({ carId: this._id });
  next();
});

export default Car;