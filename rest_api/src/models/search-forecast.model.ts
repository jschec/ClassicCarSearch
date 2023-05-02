import { model, Schema } from 'mongoose';

import { 
  ISearchForecastDoc, ISearchForecastModel
} from '../interfaces/search-forecast.interfaces';
import Search from './search.model';

const searchForecastSchema = new Schema<
  ISearchForecastDoc, ISearchForecastModel
>(
  {
    search: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Search',
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
  },
  {
    timestamps: true,
  }
);

const SearchForecast = model<ISearchForecastDoc, ISearchForecastModel>(
  'SearchForecast', searchForecastSchema
);

/**
 * A pre-save hook to apply additional validation logic to the SearchForecast
 * document before saving it to the database.
 */
searchForecastSchema.pre('validate', async function(next) {
  const searchExists = await Search.exists({ _id: this.search });

  if (!searchExists) {
    next(new Error('Search does not exist'));
  }

  next();
});

export default SearchForecast;