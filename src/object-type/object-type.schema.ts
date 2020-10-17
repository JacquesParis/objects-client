import {IJsonSchema} from './../model/i-json-schema';
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
      ],
    },
    // tslint:disable-next-line: object-literal-sort-keys
    definition: {
      type: 'object',
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
