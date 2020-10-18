import {IJsonSchema} from '@jacquesparis/objects-model';
export const OBJECT_NODE_SCHEMA: IJsonSchema = {
  properties: {
    name: {
      type: 'string',
      // tslint:disable-next-line: object-literal-sort-keys
      title: 'Name',
      default: '',
      minLength: 3,
      required: true,
    },
  },
};
