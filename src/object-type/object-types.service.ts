import {EntityName} from '../model/entity-name';
import {IJsonSchema} from '../model/i-json-schema';
import {IRestEntityService} from '../rest/i-rest-entity.service';
import {IRestService} from '../rest/i-rest.service';
import {RestFullService} from '../rest/rest-full.service';
import {ObjectTypeImpl} from './object-type.impl';

const OBJECT_TYPE_SCHEMA: IJsonSchema = {
  properties: {
    name: {
      type: 'string',
      // tslint:disable-next-line: object-literal-sort-keys
      title: 'Object type name',
      default: '',
      minLength: 3,
      required: true,
    },
    type: {
      type: 'string',
      // tslint:disable-next-line: object-literal-sort-keys
      title: 'Stockage type',
      default: '',
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
      default: {},
      required: true,
    },
  },
};
export class ObjectTypesService extends RestFullService<ObjectTypeImpl> implements IRestEntityService<ObjectTypeImpl> {
  public static getService(httpService: IRestService, baseUri: string) {
    if (!ObjectTypesService.SERVICE) {
      ObjectTypesService.SERVICE = new ObjectTypesService(httpService, baseUri);
    }
    return ObjectTypesService.SERVICE;
  }
  protected static SERVICE: ObjectTypesService;

  protected constructor(public httpService: IRestService, public baseUri: string) {
    super(EntityName.objectType, OBJECT_TYPE_SCHEMA, ObjectTypeImpl, httpService, baseUri);
  }

  public async getAll(): Promise<ObjectTypeImpl[]> {
    return super._getAll();
  }
}
