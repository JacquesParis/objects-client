import {
  IActionsLoggingService,
  ObjectClientConfigurationService,
} from './../helper/object-client-configuration.service';
import {ObjectClientService} from './../object-client.service';
import {IRestHeaders, IRestQueryParam, IRestResponse, IRestService} from './i-rest.service';
export class ProxyHttpService implements IRestService, IActionsLoggingService {
  constructor(public httpService: IRestService) {}
  public initAction(id: string): void {
    if (ObjectClientConfigurationService.optionalServices.actionsLoggingService) {
      ObjectClientConfigurationService.optionalServices.actionsLoggingService.initAction(id);
    }
  }
  public endAction(id: string): void {
    if (ObjectClientConfigurationService.optionalServices.actionsLoggingService) {
      ObjectClientConfigurationService.optionalServices.actionsLoggingService.endAction(id);
    }
  }
  public async get<T>(uri: string, queryParams?: IRestQueryParam, headers?: IRestHeaders): Promise<IRestResponse<T>> {
    try {
      this.initAction('GET ' + uri);
      return await this.httpService.get<T>(uri, queryParams, headers);
    } finally {
      this.endAction('GET ' + uri);
    }
  }
  public async put<T>(uri: string, entity: T, headers?: IRestHeaders): Promise<IRestResponse<T>> {
    try {
      this.initAction('PUT ' + uri);
      return await this.httpService.put<T>(uri, entity, headers);
    } finally {
      this.endAction('PUT ' + uri);
    }
  }
  public async delete<T>(uri: string, headers?: IRestHeaders): Promise<IRestResponse<void>> {
    try {
      this.initAction('DELETE ' + uri);
      return await this.httpService.delete<T>(uri, headers);
    } finally {
      this.endAction('DELETE ' + uri);
    }
  }
  public async patch<T>(uri: string, entity: T, headers?: IRestHeaders): Promise<IRestResponse<T>> {
    try {
      this.initAction('PATCH ' + uri);
      return await this.httpService.patch<T>(uri, entity, headers);
    } finally {
      this.endAction('PATCH ' + uri);
    }
  }
  public async post<T>(uri: string, entity: T, headers?: IRestHeaders): Promise<IRestResponse<T>> {
    try {
      this.initAction('POST ' + uri);
      return await this.httpService.post<T>(uri, entity, headers);
    } finally {
      this.endAction('POST ' + uri);
    }
  }
}
