import {IJsonSchema} from '@jacquesparis/objects-model';

export const OBJECT_SUB_TYPE_SCHEMA: IJsonSchema = {
  properties: {
    name: {
      type: 'string',
      title: 'Name of the relation to the sub-object',
      required: true,
    },

    subObjectTypeId: {
      type: 'string',
      title: 'Type of sub-object',
      required: true,
    },
    min: {
      type: 'number',
      title: 'Minimum number of child',
      minimum: 0,
      default: 0,
    },
    max: {
      type: 'number',
      title: 'Maximum number of child',
      default: Number.MAX_SAFE_INTEGER,
      maximum: Number.MAX_SAFE_INTEGER,
    },
    owner: {
      type: 'boolean',
      title: 'Owner',
      default: false,
    },
    namespace: {
      type: 'boolean',
      title: 'Space name (tree name must be unique inside this namespace)',
      default: false,
    },
    tree: {
      type: 'boolean',
      title: 'Root of a new tree',
      default: false,
    },
    acl: {
      type: 'boolean',
      title: 'Will determine access rights',
      default: false,
    },
    exclusions: {
      type: 'array',
      title: 'Incompatible sub types',
      items: {
        type: 'string',
      },
    },
    mandatories: {
      type: 'array',
      title: 'Mandatory sub types',
      items: {
        type: 'string',
      },
    },
  },
};
