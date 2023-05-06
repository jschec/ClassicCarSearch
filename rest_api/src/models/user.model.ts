import { randomUUID } from 'crypto';
import { model, Schema } from 'mongoose';
import validator from 'validator';

import { IUserDoc, IUserModel } from '../interfaces/user.interfaces';
import WatchList from './watch-list.model';
import Subscription from './subscription.model';

const userSchema = new Schema<IUserDoc, IUserModel>(
  {
    _id: {
      type: String,
      default: () => randomUUID(),
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value: string) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    pictureUri: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    subscription: {
      type: String,
      required: false,
      ref: 'Subscription',
    },
    watchList: {
      type: String,
      required: false,
      ref: 'WatchList',
    }
  },
  {
    timestamps: true,
  }
);

/**
 * Check if the email associated with the user is already associated with 
 * another user
 * 
 * @param {string} email  The email to be checked
 * @param {ObjectId} [excludeUserId]  The id of the user to be excluded
 * @returns {Promise<boolean>} Promise indicating if the email is taken or not
 */
userSchema.static('isEmailTaken', async function (email: string, excludeUserId: string): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
});

/**
 * A pre deleteOne hook to delete the WatchList document associated with the
 * Search document being deleted.
 */
userSchema.pre("deleteOne", { document: true, query: false }, async function (next) {
  await WatchList.deleteOne({ _id: this.watchList });
  next();
});

/**
 * A pre-save hook to apply additional validation logic to the User
 * document before saving it to the database.
 */
userSchema.pre('validate', async function(next) {
  if (this.subscription) {
    const subscriptionExists = await Subscription.exists({ _id: this.subscription });

    if (!subscriptionExists) {
      next(new Error('Subscription does not exist'));
    }
  }

  if (this.watchList) {
    const watchListExists = await WatchList.exists({ _id:  this.watchList });

    if (!watchListExists) {
      next(new Error('WatchList does not exist'));
    }
  }

  next();
});

const User = model<IUserDoc, IUserModel>('User', userSchema);

export default User;