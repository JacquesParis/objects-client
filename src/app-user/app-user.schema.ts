import {IJsonSchema} from '@jacquesparis/objects-model';
export const APP_USER_SCHEMA: IJsonSchema = {
  properties: {
    email: {
      type: 'string',
      // tslint:disable-next-line: object-literal-sort-keys
      title: 'EMail',
      default: '',
      minLength: 3,
      required: true,
      format: 'email',
    },
    name: {
      type: 'string',
      // tslint:disable-next-line: object-literal-sort-keys
      title: 'Name',
      default: '',
      minLength: 3,
    },

    firstname: {
      type: 'string',
      default: '',
    },
    lastname: {
      type: 'string',
      default: '',
    },
    password: {
      type: 'string',
      default: '',
      minLength: 8,
    },
  },
};
