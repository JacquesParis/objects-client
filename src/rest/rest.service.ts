import {IRestEntity} from '@jacquesparis/objects-model';
import {IEntityPropertiesWrapper} from '../model';
import {EntityName} from '../model/entity-name';
import {IJsonSchema} from '../model/i-json-schema';
import {IRestQueryParam, IRestResponse, IRestService} from './i-rest.service';
import {RestEntityImpl} from './rest-entity.impl';
export class RestService<T extends RestEntityImpl<T>> {
  constructor(
    public entityName: EntityName,
    public entityDefinition: IJsonSchema,
    protected cnstrctor: new (restService: RestService<T>) => T,
    public httpService: IRestService,
    public baseUri?: string,
    public parent: EntityName = null,
  ) {}

  protected getEntityUri(entityName: EntityName = this.entityName, params: string[] = []): string {
    return `${this.baseUri}/${this.camelToKebabCase(entityName)}s/${params.join('/')}${0 < params.length ? '/' : ''}`;
  }

  protected get restUri(): string {
    return this.getEntityUri();
  }

  protected async _get(uri: string): Promise<T> {
    const restRes: IRestResponse<T> = await this.httpService.get<T>(uri);
    return this.getEntity(restRes.result);
  }

  protected async _getAll(queryParams?: IRestQueryParam): Promise<T[]> {
    const restRes: IRestResponse<T[]> = await this.httpService.get<T[]>(this.restUri, queryParams);
    const res: T[] = [];
    restRes.result.forEach(oneResult => {
      res.push(this.getEntity(oneResult));
    });
    return res;
  }

  protected getEntity(result) {
    return new this.cnstrctor(this).assign(result);
  }

  protected async _put(uri: string, entity: Partial<T>): Promise<void> {
    await this.httpService.put<Partial<T>>(uri, entity);
  }

  protected async _patch(uri: string, entity: Partial<T>): Promise<void> {
    await this.httpService.patch<Partial<T>>(uri, entity);
  }

  protected async _post(entity: Partial<T>): Promise<T> {
    const restRes: IRestResponse<Partial<T>> = await this.httpService.post<Partial<T>>(
      this.getParentUri(entity),
      entity,
    );
    return this.getEntity(restRes.result);
  }

  protected getParentUri(entity: Partial<T>): string {
    if (!this.parent) {
      return this.restUri;
    }
    return `${this.getEntityUri(this.parent) + entity[this.parent + 'Id']}/${this.camelToKebabCase(this.entityName)}s/`;
  }

  protected async _delete(uri: string): Promise<void> {
    await this.httpService.delete(uri);
  }

  private camelToKebabCase(str: string) {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  }
}
