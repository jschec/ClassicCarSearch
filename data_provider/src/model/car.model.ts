import { randomUUID } from 'crypto';
import { Schema, model } from 'mongoose';

import { Condition } from '../interface/condition.interfaces';
import { ICarDoc, ICarModel } from '../interface/car.interface';
import CarListing from './car-listing.model';
import toJSON from '../utils/toJson';

const carSchema = new Schema<ICarDoc, ICarModel>(
  {
    _id: {
      type: Schema.Types.UUID,
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
    externalId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

// Add plugin to converts mongoose documents to json
carSchema.plugin(toJSON);

/**
 * A pre deleteOne hook to delete all CarListing documents associated with
 * the Car document being deleted.
 */
carSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  await CarListing.deleteMany({ carId: this._id });
  next();
});

const Car = model<ICarDoc, ICarModel>('Car', carSchema);


export default Car;