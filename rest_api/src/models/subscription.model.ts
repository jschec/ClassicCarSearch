import mongoose from 'mongoose';
import validator from 'validator';

import { 
  ISubscriptionDoc, ISubscriptionModel 
} from '../interfaces/subscription.interfaces';

const subscriptionSchema = new mongoose.Schema<
  ISubscriptionDoc, ISubscriptionModel
>(
  {
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

const Subscription = mongoose.model<ISubscriptionDoc, ISubscriptionModel>(
  'Subscription', subscriptionSchema
);

export default Subscription;