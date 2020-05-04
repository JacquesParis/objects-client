import {EntityName} from '../model/entity-name';
import {IJsonSchema} from '../model/i-json-schema';
import {
  CONTENT_TYPE_FILE,
  CONTENT_TYPE_FILES,
  CONTENT_TYPE_JSON,
  CONTENT_TYPE_TEXT,
} from '../model/object-content-type';
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
