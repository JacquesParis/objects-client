import {IJsonSchema} from '@jacquesparis/objects-model';
import {
  CONTENT_TYPE_FILE,
  CONTENT_TYPE_FILES,
  CONTENT_TYPE_JSON,
  CONTENT_TYPE_TEXT,
} from './../model/object-content-type';

export const OBJECT_TYPE_SCHEMA: IJsonSchema = {
  properties: {
    name: {
      type: 'string',
      // tslint:disable-next-line: object-literal-sort-keys
      title: 'Object type name',
      default: '',
      minLength: 3,
      required: true,
    },

    inheritedTypesIds: {
      type: 'array',
      title: 'Inherited types',
      items: {
        type: 'string',
        default: '',
      },
    },
    contentType: {
      type: 'string',
      // tslint:disable-next-line: object-literal-sort-keys
      title: 'Stockage type',
      default: '',
      nullable: false,
      oneOf: [
        {
          enum: [CONTENT_TYPE_JSON],
          title: 'Default structure object (JSON)',
        },
        {
          enum: [CONTENT_TYPE_FILE],
          title: 'File content',
        },
        {
          enum: [CONTENT_TYPE_FILES],
          title: 'Files list content',
        },
        {
          enum: [CONTENT_TYPE_TEXT],
          title: 'Text content',
        },
        {
          enum: ['ContentUser'],
          title: 'User',
        },
      ],
    },
    // tslint:disable-next-line: object-literal-sort-keys
    definition: {
      type: 'string',
      // tslint:disable-next-line: object-literal-sort-keys
      title: 'Object type json schema description',
      'x-schema-form': {
        type: 'json',
      },
      default: {},
      required: true,
    },
  },
};
