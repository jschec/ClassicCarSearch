import { model, Schema } from 'mongoose';

import { ISearchDoc, ISearchModel } from '../interfaces/search.interfaces';
import CarListing from './car-listing.model';
import SearchCriteria from './search-criteria.model';
import SearchForecast from './search-forecast.model';
import WatchList from './watch-list.model';

const searchSchema = new Schema<ISearchDoc, ISearchModel>(
  {
    watchListId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    resultIds: {
      type: [Schema.Types.ObjectId],
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const Search = model<ISearchDoc, ISearchModel>('Search', searchSchema);

/**
 * A pre-save hook to apply additional validation logic to the CarListing
 * document before saving it to the database.
 */
searchSchema.pre('validate', async function(next) {
  const watchListExists = await WatchList.exists({ _id: this.watchListId });

  // Exit out before countDocuments since it's an expensive operation
  if (!watchListExists) {
    next(new Error('WatchList does not exist'));
  }

  const resultCount = await CarListing.countDocuments({ id: { $in: this.resultIds } });

  if (resultCount !== this.resultIds.length) {
    next(new Error('One or more results do not exist'));
  }

  next();
});

/**
 * A pre deleteOne hook to delete all SearchCriteria and SearchForecast
 * documents associated with the Search document being deleted.
 */
searchSchema.pre("deleteOne", { document: false, query: true }, async function (next) {
  const doc = await this.findOne(this.getFilter());

  await SearchCriteria.deleteOne({ searchId: doc._id });
  await SearchForecast.deleteMany({ searchId: doc._id });

  next();
});

export default Search;