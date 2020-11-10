export interface IRestQueryParam {
  [param: string]: any;
}

export interface IRestHeaders {
  [header: string]: string | string[];
}

export interface IRestResponse<T> {
  result: T;
  status: number;
}

export interface IRestService {
  get<T>(uri: string, queryParams?: IRestQueryParam, headers?: IRestHeaders): Promise<IRestResponse<T>>;
  put<T>(uri: string, entity: T, headers?: IRestHeaders): Promise<IRestResponse<T>>;
  delete<T>(uri: string, headers?: IRestHeaders): Promise<IRestResponse<void>>;
  patch<T>(uri: string, entity: T, headers?: IRestHeaders): Promise<IRestResponse<T>>;
  post<T>(uri: string, entity: T, headers?: IRestHeaders): Promise<IRestResponse<T>>;
}
