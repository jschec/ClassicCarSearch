/* eslint-disable no-param-reassign */
import { Document } from 'mongoose';

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, _id
 */
const toJSON = (schema: any) => {
  let transform: Function;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  // eslint-disable-next-line no-param-reassign
  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc: Document, ret: any, options: Record<string, any>) {
      // eslint-disable-next-line no-param-reassign
      delete ret._id;
      // eslint-disable-next-line no-param-reassign
      delete ret.__v;
      
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

export default toJSON;