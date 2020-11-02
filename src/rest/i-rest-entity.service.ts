import {IJsonSchema} from '@jacquesparis/objects-model';
import {EntityName} from '../model/entity-name';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {IRestService} from './i-rest.service';
export abstract class IRestEntityService<T extends IEntityPropertiesWrapper<T>> {
  public static cachedObject: {[uri: string]: any} = {};
  public httpService: IRestService;
  public baseUri?: string;
  public entityName: EntityName;
  public entityDefinition: IJsonSchema;
  public get?(uri: string): Promise<T>;
  public put?(uri: string, objectType: Partial<T>): Promise<T>;
  public patch?(uri: string, objectType: Partial<T>): Promise<T>;
  public post?(objectType: Partial<T>): Promise<T>;
  public delete?(uri: string): Promise<void>;
  public abstract getCachedObjects(): T[];
  public abstract getCachedObject(uri): T;
  public abstract getCachedObjectById(id): T;
  public abstract storeInCachedObject(entity: T | T[] | any);
  public abstract removeFromCachedObject(entity: T | T[] | any);
  public abstract getUri(id: string): string;
}
