import { randomUUID } from 'crypto';
import { model, Schema } from 'mongoose';

import { 
  IWatchListDoc, IWatchListModel 
} from '../interfaces/watch-list.interfaces';
import User from './user.model';
import toJSON from '../utils/toJson';

const watchListSchema = new Schema<IWatchListDoc, IWatchListModel>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
    },
    user: {
      type: Schema.Types.UUID,
      required: true,
      ref: 'User'
    },
    searches: [{
      type: Schema.Types.UUID,
      required: false,
      ref: 'Search'
    }]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
  }
);

// Add plugin to converts mongoose documents to json
watchListSchema.plugin(toJSON);

/**
 * A pre-save hook to apply additional validation logic to the User
 * document before saving it to the database.
 */
watchListSchema.pre('validate', async function(next) {
  const userExists = await User.exists({ _id: this.user });

  if (!userExists) {
    next(new Error('User does not exist'));
  } 

  next();
});

const WatchList = model<IWatchListDoc, IWatchListModel>(
  'WatchList', watchListSchema
);

export default WatchList;