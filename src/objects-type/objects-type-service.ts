import {EntityName} from '../model/entity-name';
import {IJsonSchema} from '../model/i-json-shema';
import {IRestEntityService} from '../rest/i-rest-entity-service';
import {IRestService} from '../rest/i-rest-service';
import {RestService} from '../rest/rest-service';
import {ObjectTypeImpl} from './object-type.impl';

const OBJECT_TYP_SCHEMA: IJsonSchema = {
  properties: {
    name: {
      type: 'string',
      // tslint:disable-next-line: object-literal-sort-keys
      title: 'Object type name',
      minLength: 3,
      required: true,
    },
    type: {
      type: 'string',
      // tslint:disable-next-line: object-literal-sort-keys
      title: 'Stockage type',
      required: true,
    },
    // tslint:disable-next-line: object-literal-sort-keys
    definition: {
      type: 'object',
      // tslint:disable-next-line: object-literal-sort-keys
      title: 'Object type json schema description',
      'x-schema-form': {
        type: 'json',
      },
      required: true,
    },
  },
};
export class ObjectsTypeService extends RestService<ObjectTypeImpl> implements IRestEntityService<ObjectTypeImpl> {
  constructor(protected httpService: IRestService, protected server: string) {
    super(EntityName.objectType, OBJECT_TYP_SCHEMA, ObjectTypeImpl, httpService, server);
  }

  public async get(uri: string): Promise<ObjectTypeImpl> {
    return super._get(uri);
  }
  public async getAll(): Promise<ObjectTypeImpl[]> {
    return super._getAll({
      filter: {
        fields: {
          definition: true,
          id: true,
          name: true,
          type: true,
          uri: true,
        },
        include: [
          {
            relation: 'objectSubTypes',
          },
        ],
      },
    });
  }

  public async put(uri: string, objectType: Partial<ObjectTypeImpl>): Promise<void> {
    return super._put(uri, objectType);
  }

  public async patch(uri: string, objectType: Partial<ObjectTypeImpl>): Promise<void> {
    return super._patch(uri, objectType);
  }

  public post(objectType: Partial<ObjectTypeImpl>): Promise<ObjectTypeImpl> {
    return this._post(objectType);
  }
}
