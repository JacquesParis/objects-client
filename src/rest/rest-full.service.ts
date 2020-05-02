import {EntityName} from '../model/entity-name';
import {IJsonSchema} from '../model/i-json-schema';
import {IRestService} from './i-rest.service';
import {RestEntityImpl} from './rest-entity.impl';
import {RestService} from './rest.service';

export class RestFullService<T extends RestEntityImpl<T>> extends RestService<T> {
  constructor(
    public entityName: EntityName,
    public entityDefinition: IJsonSchema,
    protected cnstrctor: new (restService: RestService<T>) => T,
    public httpService: IRestService,
    public baseUri?: string,
  ) {
    super(entityName, entityDefinition, cnstrctor, httpService, baseUri);
  }

  public async get(uri: string): Promise<T> {
    return super._get(uri);
  }
  public async put(uri: string, objectType: Partial<T>): Promise<void> {
    return super._put(uri, objectType);
  }

  public async patch(uri: string, objectType: Partial<T>): Promise<void> {
    return super._patch(uri, objectType);
  }

  public post(objectType: Partial<T>): Promise<T> {
    return this._post(objectType);
  }

  public delete(uri: string): Promise<void> {
    return super._delete(uri);
  }
}
