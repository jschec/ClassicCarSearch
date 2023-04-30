import { model, Schema } from 'mongoose';

import { 
  ISearchCriteriaDoc, ISearchCriteriaModel
} from '../interfaces/search-criteria.interfaces';

const searchCriteriaSchema = new Schema<
  ISearchCriteriaDoc, ISearchCriteriaModel
>(
  {
    region: {
      type: String,
      required: false,
    },
    maxMileage: {
      type: Number,
      required: false,
      min: 0,
      max: 1000000 // 1 million miles
    },
    maxPrice: {
      type: Number,
      required: false,
      min: 0,
      max: 100000000 // 100 million
    },
    exteriorCondition: {
      type: String,
      required: false,
    },
    mechanicalCondition: {
      type: String,
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    make: {
      type: String,
      required: false,
    },
    model: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const SearchCriteria = model<ISearchCriteriaDoc, ISearchCriteriaModel>(
  'SearchCriteria', searchCriteriaSchema
);

export default SearchCriteria;