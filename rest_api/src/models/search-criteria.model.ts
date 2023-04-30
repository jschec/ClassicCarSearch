import { model, Schema } from 'mongoose';

import { 
  ISearchCriteriaDoc, ISearchCriteriaModel
} from '../interfaces/search-criteria.interfaces';
import Search from './search.model';

const searchCriteriaSchema = new Schema<
  ISearchCriteriaDoc, ISearchCriteriaModel
>(
  {
    searchId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
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

/**
 * A pre-save hook to apply additional validation logic to the CarListing
 * document before saving it to the database.
 */
searchCriteriaSchema.pre('validate', async function(next) {
  const searchExists = await Search.exists({ _id: this.searchId });

  if (!searchExists) {
    next(new Error('Search does not exist'));
  }

  next();
});

export default SearchCriteria;