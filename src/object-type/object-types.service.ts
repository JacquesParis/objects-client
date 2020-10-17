import {EntityName} from '../model/entity-name';
import {IRestEntityService} from '../rest/i-rest-entity.service';
import {IRestService} from '../rest/i-rest.service';
import {RestFullService} from '../rest/rest-full.service';
import {ObjectTypeImpl} from './object-type.impl';
import {OBJECT_TYPE_SCHEMA} from './object-type.schema';

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
