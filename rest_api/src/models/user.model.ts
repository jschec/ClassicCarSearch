import { model, Schema, ObjectId } from 'mongoose';
import validator from 'validator';

import { IUserDoc, IUserModel } from '../interfaces/user.interfaces';

const userSchema = new Schema<IUserDoc, IUserModel>(
  {
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
    watchListId: {
      type: Schema.Types.ObjectId,
      required: false,
      trim: true,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      required: false,
      trim: true,
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
userSchema.static('isEmailTaken', async function (email: string, excludeUserId: ObjectId): Promise<boolean> {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
});

const User = model<IUserDoc, IUserModel>('User', userSchema);

export default User;