import { model, Schema } from 'mongoose';

import { ISearchDoc, ISearchModel } from '../interfaces/search.interfaces';
import CarListing from './car-listing.model';
import SearchCriteria from './search-criteria.model';
import SearchForecast from './search-forecast.model';

const searchSchema = new Schema<ISearchDoc, ISearchModel>(
  {
    results: [{
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'CarListing',
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

searchSchema.virtual('criterias', {
  ref: 'SearchCriteria',
  localField: '_id',
  foreignField: 'search',
});

const Search = model<ISearchDoc, ISearchModel>('Search', searchSchema);

/**
 * A pre-save hook to apply additional validation logic to the CarListing
 * document before saving it to the database.
 */
searchSchema.pre('validate', async function(next) {
  let resultIds: String[] = [];

  this.results.forEach(item => {
    const resultId = (item instanceof Schema.Types.ObjectId) ? item : item._id;
    resultIds.push(resultId);
  });
  
  const resultCount = await CarListing.countDocuments({ id: { $in: resultIds } });

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

export default Search;