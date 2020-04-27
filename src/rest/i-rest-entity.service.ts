import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {IRestService} from '../rest/i-rest-service';
export abstract class IRestEntityService<T extends IEntityPropertiesWrapper<T>> {
  public httpService: IRestService;
  public baseUri?: string;
  public get?(uri: string): Promise<T>;
  public put?(uri: string, objectType: Partial<T>): Promise<void>;
  public patch?(uri: string, objectType: Partial<T>): Promise<void>;
  public post?(objectType: Partial<T>): Promise<T>;
}
