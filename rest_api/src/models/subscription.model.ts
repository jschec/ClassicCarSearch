import { randomUUID } from 'crypto';
import { model, Schema } from 'mongoose';

import { 
  ISubscriptionDoc, ISubscriptionModel 
} from '../interfaces/subscription.interfaces';
import toJSON from '../utils/toJson';

const subscriptionSchema = new Schema<
  ISubscriptionDoc, ISubscriptionModel
>(
  {
    _id: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    cost: {
      type: Number,
      required: true,
      min: 0,
    },
    features: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true },
  }
);

// Add plugin to converts mongoose documents to json
subscriptionSchema.plugin(toJSON);

/**
 * Check if the name associated with the subscripion is already associated with 
 * another subscripion
 * 
 * @param {string} name  The name to be checked
 * @param {string} [excludeRecId]  The id of the subscription to be excluded
 * @returns {Promise<boolean>} Promise indicating if the name is taken or not
 */
subscriptionSchema.static('isNameTaken', async function (name: string, excludeRecId: string): Promise<boolean> {
  const record = await this.findOne({ name, _id: { $ne: excludeRecId } });
  return !!record;
});

const Subscription = model<ISubscriptionDoc, ISubscriptionModel>(
  'Subscription', subscriptionSchema
);

export default Subscription;