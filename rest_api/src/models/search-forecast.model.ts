import { model, Schema } from 'mongoose';

import { 
  ISearchForecastDoc, ISearchForecastModel
} from '../interfaces/search-forecast.interfaces';

const searchForecastSchema = new Schema<
  ISearchForecastDoc, ISearchForecastModel
>(
  {
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

export default SearchForecast;