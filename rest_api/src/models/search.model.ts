import { randomUUID } from 'crypto';
import { model, Schema } from 'mongoose';

import { ISearchDoc, ISearchModel } from '../interfaces/search.interfaces';
import CarListing from './car-listing.model';
import SearchCriteria from './search-criteria.model';
import SearchForecast from './search-forecast.model';

const searchSchema = new Schema<ISearchDoc, ISearchModel>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
    },
    results: [{
      type: Schema.Types.UUID,
      required: false,
      ref: 'CarListing',
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
  }
);

// Add plugin to converts mongoose documents to json

searchSchema.virtual('criteria', {
  ref: 'SearchCriteria',
  localField: '_id',
  foreignField: 'search',
  justOne: true
});

/**
 * A pre-save hook to apply additional validation logic to the CarListing
 * document before saving it to the database.
 */
searchSchema.pre('validate', async function(next) {
  let resultIds: String[] = [];

  this.results.forEach(item => {
    resultIds.push(item as String);
  });
  
  const resultCount = await CarListing.countDocuments({ _id: { $in: resultIds } });

  if (resultCount !== this.results.length) {
    next(new Error('One or more results do not exist'));
  }

  next();
});

/**
 * A pre deleteOne hook to delete all SearchCriteria and SearchForecast
 * documents associated with the Search document being deleted.
 */
searchSchema.pre("deleteOne", { document: true, query: false }, async function (next) {

  await SearchCriteria.deleteOne({ searchId: this._id });
  await SearchForecast.deleteMany({ searchId: this._id });

  next();
});

const Search = model<ISearchDoc, ISearchModel>('Search', searchSchema);

export default Search;