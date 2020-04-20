import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
export abstract class IRestEntityService<T extends IEntityPropertiesWrapper<T>> {
  public get?(uri: string): Promise<T>;
  public put?(uri: string, objectType: Partial<T>): Promise<void>;
  public patch?(uri: string, objectType: Partial<T>): Promise<void>;
  public post?(objectType: Partial<T>): Promise<T>;
}
