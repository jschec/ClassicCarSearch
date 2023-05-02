import { model, Schema } from 'mongoose';

import { 
  IWatchListDoc, IWatchListModel 
} from '../interfaces/watch-list.interface';
import User from './user.model';

const watchListSchema = new Schema<IWatchListDoc, IWatchListModel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    searches: [{
      type: Schema.Types.ObjectId,
      required: false,
      ref: 'Search'
    }]
  },
  {
    timestamps: true,
  }
);

const WatchList = model<IWatchListDoc, IWatchListModel>(
  'WatchList', watchListSchema
);

/**
 * A pre-save hook to apply additional validation logic to the User
 * document before saving it to the database.
 */
watchListSchema.pre('validate', async function(next) {
  const userExists = await User.exists({ _id: this.user._id });

  if (!userExists) {
    next(new Error('User does not exist'));
  } 

  next();
});

export default WatchList;