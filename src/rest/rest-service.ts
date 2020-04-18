import {IRestEntity} from '@jacquesparis/objects-model';
import {IRestQueryParam, IRestResponse, IRestService} from './i-rest-service';
export class RestService<T extends IRestEntity> {
  constructor(protected cnstrctor: new () => T, protected httpService: IRestService, protected server?: string) {}

  protected async _get(uri: string): Promise<T> {
    const restRes: IRestResponse<T> = await this.httpService.get<T>(uri);
    return Object.assign(new this.cnstrctor(), restRes.result);
  }

  protected async _getAll(queryParams?: IRestQueryParam): Promise<T[]> {
    const restRes: IRestResponse<T[]> = await this.httpService.get<T[]>(this.server, queryParams);
    const res: T[] = [];
    restRes.result.forEach(oneResult => {
      res.push(Object.assign(new this.cnstrctor(), oneResult));
    });
    return res;
  }

  protected async _put(uri: string, entity: Partial<T>): Promise<void> {
    await this.httpService.put<Partial<T>>(uri, entity);
  }
}
