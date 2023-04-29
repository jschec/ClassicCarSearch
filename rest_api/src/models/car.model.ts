import { Schema, model } from 'mongoose';

import { ICarDoc, ICarModel } from '../interfaces/car.interfaces';

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
      required: true
    },
    mechanicalCondition: {
      type: String,
      required: true
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

export default Car;