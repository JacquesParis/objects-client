import { IDataEntity } from '@jacquesparis/objects-model';

import { IRequestOptions, IRestResponse, RestClient } from 'typed-rest-client/RestClient';

interface IRestQueryParam {
  [param: string]: any
}

export class RestService<T extends IDataEntity> {
  protected rest: RestClient;

  constructor(protected server?: string) {
    this.rest = new RestClient('typed-rest-client-tests');
  }

  protected async get(uri: string): Promise<T> {
    const restRes: IRestResponse<T> = await this.rest.get<T>(uri);
    return restRes.result;
  }

  protected async getAll(queryParams?: IRestQueryParam): Promise<T[]> {
    const options: IRequestOptions = {};
    if (queryParams && 0 < Object.keys(queryParams).length) {
      options.queryParameters = {
        params: {}
      };
      Object.keys(queryParams).forEach(key => {
        options.queryParameters.params[key] = JSON.stringify(queryParams[key]);
      })
    }
    const restRes: IRestResponse<T[]> = await this.rest.get<T[]>(this.server, options);
    return restRes.result;
  }
}
