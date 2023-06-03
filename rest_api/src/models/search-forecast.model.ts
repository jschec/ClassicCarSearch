import { randomUUID } from 'crypto';
import { model, Schema } from 'mongoose';

import { 
  ISearchForecastDoc, ISearchForecastModel
} from '../interfaces/search-forecast.interfaces';
import Search from './search.model';
import Car from './car.model';
import toJSON from '../utils/toJson';

const searchForecastSchema = new Schema<
  ISearchForecastDoc, ISearchForecastModel
>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
    },
    avgTimeOnMarket: {
      type: Number,
      required: true,
      min: 0,
      max: 36500 // 100 years
    },
    avgPrice: {
      type: Number,
      required: true,
      min: 0,
      max: 1000000 // 1 million miles
    },
    averageMileage: {
      type: Number,
      required: true,
      min: 0,
      max: 100000000 // 100 million
    },
    ttl: {
      type: Number,
      required: true,
    },
    priceHistory: {
      type: [Number],
      required: false,
    },
    forecastRegion: {
      type: String,
      required: false
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
  }
);

// Add plugin to converts mongoose documents to json
searchForecastSchema.plugin(toJSON);

/**
 * A pre-save hook to apply additional validation logic to the SearchForecast
 * document before saving it to the database.
 */
searchForecastSchema.pre('validate', async function(next) {
  const carExists = await Car.exists({ _id: this.search });

  if (!carExists) {
    next(new Error('Car for forecast does not exist'));
  }

  next();
});


const SearchForecast = model<ISearchForecastDoc, ISearchForecastModel>(
  'SearchForecast', searchForecastSchema
);

export default SearchForecast;