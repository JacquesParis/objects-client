import {IRestEntity} from '@jacquesparis/objects-model';
import {EntityName} from '../model/entity-name';
import {IJsonSchema} from '../model/i-json-shema';
import {IRestQueryParam, IRestResponse, IRestService} from './i-rest-service';
export class RestService<T extends IRestEntity> {
  constructor(
    public entityName: EntityName,
    public entityDefinition: IJsonSchema,
    protected cnstrctor: new (restService: RestService<T>) => T,
    protected httpService: IRestService,
    protected server?: string,
  ) {}

  protected async _get(uri: string): Promise<T> {
    const restRes: IRestResponse<T> = await this.httpService.get<T>(uri);
    return Object.assign(new this.cnstrctor(this), restRes.result);
  }

  protected async _getAll(queryParams?: IRestQueryParam): Promise<T[]> {
    const restRes: IRestResponse<T[]> = await this.httpService.get<T[]>(this.server, queryParams);
    const res: T[] = [];
    restRes.result.forEach(oneResult => {
      res.push(Object.assign(new this.cnstrctor(this), oneResult));
    });
    return res;
  }

  protected async _put(uri: string, entity: Partial<T>): Promise<void> {
    await this.httpService.put<Partial<T>>(uri, entity);
  }

  protected async _patch(uri: string, entity: Partial<T>): Promise<void> {
    await this.httpService.patch<Partial<T>>(uri, entity);
  }

  protected async _post(entity: Partial<T>): Promise<T> {
    const restRes: IRestResponse<Partial<T>> = await this.httpService.post<Partial<T>>(this.server, entity);
    return Object.assign(new this.cnstrctor(this), restRes.result);
  }
}
