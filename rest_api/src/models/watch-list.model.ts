import { model, Schema } from 'mongoose';

import { 
  IWatchListDoc, IWatchListModel 
} from '../interfaces/watch-list.interface';

const watchListSchema = new Schema<IWatchListDoc, IWatchListModel>(
  {
    searchIds: {
      type: [Schema.Types.ObjectId],
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const WatchList = model<IWatchListDoc, IWatchListModel>(
  'WatchList', watchListSchema
);

export default WatchList;