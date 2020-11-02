import {EntityName} from '../model/entity-name';
import {IRestEntityService} from '../rest/i-rest-entity.service';
import {IRestService} from '../rest/i-rest.service';
import {RestFullService} from '../rest/rest-full.service';
import {ObjectSubTypeImpl} from './../object-sub-type/object-sub-type.impl';
import {ObjectTypeImpl} from './object-type.impl';
import {OBJECT_TYPE_SCHEMA} from './object-type.schema';

export class ObjectTypesService extends RestFullService<ObjectTypeImpl> implements IRestEntityService<ObjectTypeImpl> {
  public static getService(httpService?: IRestService, baseUri?: string) {
    if (!ObjectTypesService.SERVICE) {
      if (!httpService || !baseUri) {
        throw new Error('service not initialized');
      }
      ObjectTypesService.SERVICE = new ObjectTypesService(httpService, baseUri);
    }
    return ObjectTypesService.SERVICE;
  }
  protected static SERVICE: ObjectTypesService;

  protected constructor(public httpService: IRestService, public baseUri: string) {
    super(EntityName.objectType, OBJECT_TYPE_SCHEMA, ObjectTypeImpl, httpService, baseUri);
  }

  public async getAll(): Promise<ObjectTypeImpl[]> {
    const objectTypes = await super._getAll();
    objectTypes.forEach(objectType => {
      if (!objectType.objectSubTypes) {
        objectType.objectSubTypes = [];
      }
      objectType.objectSubTypes.forEach((subType: ObjectSubTypeImpl) => {
        subType.objectType = this.getCachedObject(subType.subObjectTypeUri);
      });
    });
    return objectTypes;
  }
}
