import { model, Schema } from 'mongoose';

import { ISearchDoc, ISearchModel } from '../interfaces/search.interfaces';

const searchSchema = new Schema<ISearchDoc, ISearchModel>(
  {
    searchCriteriaId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    resultIds: {
      type: [Schema.Types.ObjectId],
      required: true,
    },
    forecastIds: {
      type: [Schema.Types.ObjectId],
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Search = model<ISearchDoc, ISearchModel>('Search', searchSchema);

export default Search;