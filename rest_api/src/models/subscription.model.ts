import { model, Schema, ObjectId } from 'mongoose';

import { 
  ISubscriptionDoc, ISubscriptionModel 
} from '../interfaces/subscription.interfaces';

const subscriptionSchema = new Schema<
  ISubscriptionDoc, ISubscriptionModel
>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    }
  },
  {
    timestamps: true,
  }
);

/**
 * Check if the name associated with the subscripion is already associated with 
 * another subscripion
 * 
 * @param {string} name  The name to be checked
 * @param {ObjectId} [excludeRecId]  The id of the subscription to be excluded
 * @returns {Promise<boolean>} Promise indicating if the name is taken or not
 */
subscriptionSchema.static('isNameTaken', async function (name: string, excludeRecId: ObjectId): Promise<boolean> {
  const record = await this.findOne({ name, _id: { $ne: excludeRecId } });
  return !!record;
});

const Subscription = model<ISubscriptionDoc, ISubscriptionModel>(
  'Subscription', subscriptionSchema
);

export default Subscription;