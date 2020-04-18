export interface IRestQueryParam {
  [param: string]: any;
}

export interface IRestResponse<T> {
  result: T;
  status: number;
}

export interface IRestService {
  get<T>(uri: string, queryParams?: IRestQueryParam): Promise<IRestResponse<T>>;
  put<T>(uri: string, entity: T): Promise<IRestResponse<void>>;
}
