import {EntityName} from '../model/entity-name';
import {IJsonSchema} from '../model/i-json-schema';
import {IRestEntityService} from '../rest/i-rest-entity.service';
import {IRestService} from '../rest/i-rest.service';
import {RestService} from '../rest/rest.service';
import {ObjectSubTypeImpl} from './object-sub-type.impl';

const OBJECT_SUB_TYPE_SCHEMA: IJsonSchema = {
  properties: {
    name: {
      type: 'string',
      title: 'Name of the relation to the sub-object',
    },

    subObjectTypeId: {
      type: 'string',
      title: 'Type of sub-object',
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

export class ObjectSubTypesService extends RestService<ObjectSubTypeImpl>
  implements IRestEntityService<ObjectSubTypeImpl> {
  public static getService(httpService: IRestService, baseUri: string) {
    if (!ObjectSubTypesService.SERVICE) {
      ObjectSubTypesService.SERVICE = new ObjectSubTypesService(httpService, baseUri);
    }
    return ObjectSubTypesService.SERVICE;
  }
  protected static SERVICE: ObjectSubTypesService;
  protected constructor(public httpService: IRestService, public baseUri: string) {
    super(
      EntityName.objectSubType,
      OBJECT_SUB_TYPE_SCHEMA,
      ObjectSubTypeImpl,
      httpService,
      baseUri,
      EntityName.objectType,
    );
  }

  public async patch(uri: string, objectType: Partial<ObjectSubTypeImpl>): Promise<void> {
    return super._patch(uri, objectType);
  }

  public post(objectType: Partial<ObjectSubTypeImpl>): Promise<ObjectSubTypeImpl> {
    return this._post(objectType);
  }

  public delete(uri: string): Promise<void> {
    return super._delete(uri);
  }
}
