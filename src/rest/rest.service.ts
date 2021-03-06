import {IJsonSchema, IMethodResult} from '@jacquesparis/objects-model';
import {LocalStorageWorker} from './../helper/storage-helper';
import {ProxyHttpService} from './proxy-http.service';
import {RestTools} from './rest-tools';

import {EntityName} from '../model/entity-name';
import {IRestEntityService} from './i-rest-entity.service';
import {IRestHeaders, IRestQueryParam, IRestResponse, IRestService} from './i-rest.service';
import {RestEntityImpl} from './rest-entity.impl';

import * as _ from 'lodash-es';

export class RestService<T extends RestEntityImpl<T>> extends RestTools {
  protected get restUri(): string {
    return this.getEntityUri();
  }
  public static get authToken(): string {
    if (null === RestService._authToken) {
      RestService._authToken = LocalStorageWorker.get('user.token');
      if (!RestService._authToken) {
        RestService._authToken = 'none';
      }
    }
    return 'none' === RestService._authToken ? undefined : RestService._authToken;
  }

  protected get headers(): IRestHeaders {
    const headers: IRestHeaders = {};
    if (RestService.authToken) {
      headers.Authorization = 'Bearer ' + RestService.authToken;
    }
    return headers;
  }
  public static registeredServices: {[entityName in EntityName]?: RestService<any>} = {};
  public static getEntityService(entityName: EntityName) {
    return RestService.registeredServices[entityName];
  }
  public static setAuthToken(authToken: string) {
    if (undefined === authToken) {
      authToken = 'none';
    }
    RestService._authToken = authToken;
    LocalStorageWorker.add('user.token', authToken);
  }
  private static _authToken = null;
  public httpService: IRestService;
  public formDataExtention = undefined;
  constructor(
    public entityName: EntityName,
    public entityDefinition: IJsonSchema,
    protected cnstrctor: new (restService: RestService<T>) => T,
    originalHttpService: IRestService,
    public baseUri?: string,
    public parent: EntityName = null,
  ) {
    super();
    this.httpService = new ProxyHttpService(originalHttpService);
    RestService.registeredServices[entityName] = this;
  }

  public getCachedObjects(): T[] {
    return IRestEntityService.cachedObject[this.restUri];
  }

  public getCachedObject(uri): T {
    return IRestEntityService.cachedObject[uri];
  }

  public getCachedObjectById(id): T {
    return IRestEntityService.cachedObject[this.getUri(id)];
  }

  public async getCachedOrRemoteObjectById(id): Promise<T> {
    const uri = this.getUri(id);
    const cachedObject = this.getCachedObject(uri);
    if (cachedObject) {
      await cachedObject.waitForReady();
      return cachedObject;
    }
    return this._get(uri);
  }

  public storeInCachedObject(entityOrArray: T | T[]) {
    if (_.isArray(entityOrArray)) {
      IRestEntityService.cachedObject[this.restUri] = entityOrArray;
    } else {
      const entity: T = entityOrArray as T;
      const uri = entity.uri ? entity.uri : entity.id ? this.getUri(entity.id) : null;
      if (uri) {
        IRestEntityService.cachedObject[uri] = entity;
        if (entity.aliasUri) {
          IRestEntityService.cachedObject[entity.aliasUri] = entity;
        }
        const restUri = this.restUriFromEntityUri(uri);
        if (IRestEntityService.cachedObject[restUri] && _.isArray(IRestEntityService.cachedObject[restUri])) {
          this.replaceInArray(IRestEntityService.cachedObject[restUri], entity);
        }
        if (entity.aliasUri) {
          IRestEntityService.cachedObject[entity.aliasUri] = entity;
        }
      }
    }
  }

  public removeFromCachedObject(entityOrArray: T | T[]) {
    if (_.isArray(entityOrArray)) {
      delete IRestEntityService.cachedObject[this.restUri];
    } else {
      const entity = entityOrArray as T;
      const uri = entity.uri ? entity.uri : entity.id ? this.getUri(entity.id) : null;
      if (uri) {
        const restUri = this.restUriFromEntityUri(uri);
        if (IRestEntityService.cachedObject[restUri] && _.isArray(IRestEntityService.cachedObject[restUri])) {
          this.replaceInArray(IRestEntityService.cachedObject[restUri], entity, true);
        }
        delete IRestEntityService.cachedObject[uri];
      }
    }
  }

  public getUri(id: string): string {
    return this.getEntityUri(this.entityName, [id]);
  }

  public getEntity(result: Partial<T>, refreshEntity = false): T {
    const uri = result.uri ? result.uri : result.id ? this.getUri(result.id) : null;
    let entity: T = uri && this.getCachedObject(uri);
    if (entity) {
      if (refreshEntity || true === result.entityCtx?.loaded) {
        const ref = new this.cnstrctor(this);
        for (const key in entity) {
          if (!(key in ref)) {
            delete entity[key];
          }
        }
      } else {
        return entity;
      }
    } else {
      entity = new this.cnstrctor(this);
    }
    return entity.assign(result);
  }

  public async runAction(uri: string, parameters: any): Promise<IMethodResult> {
    const restRes: IRestResponse<Partial<T>> = await this.httpService.post<any>(uri, parameters, this.headers);
    return this.getEntity(restRes.result, true);
  }

  protected getEntityUri(entityName: EntityName = this.entityName, params: string[] = []): string {
    return `${this.baseUri}/${this.camelToKebabCase(entityName)}s${0 < params.length ? '/' : ''}${params.join('/')}`;
  }

  protected async _get(uri: string): Promise<T> {
    const restRes: IRestResponse<T> = await this.httpService.get<T>(uri, undefined, this.headers);
    return this.getEntity(restRes.result, true);
  }

  protected async _getAll(queryParams?: IRestQueryParam): Promise<T[]> {
    const restRes: IRestResponse<T[]> = await this.httpService.get<T[]>(this.restUri, queryParams, this.headers);
    const res: T[] = [];
    restRes.result.forEach(oneResult => {
      res.push(this.getEntity(oneResult, true));
    });
    res.forEach(entity => {
      entity.updateReferences();
    });
    if (!queryParams) {
      this.storeInCachedObject(res);
    }
    return res;
  }

  protected async _put(uri: string, entity: Partial<T>): Promise<T> {
    const restRes: IRestResponse<Partial<T>> = await this.httpService.put<Partial<T>>(uri, entity, this.headers);
    return this.getEntity(restRes.result, true);
  }

  protected async _patch(uri: string, entity: Partial<T>): Promise<T> {
    const restRes: IRestResponse<Partial<T>> = await this.httpService.patch<Partial<T>>(uri, entity, this.headers);
    return this.getEntity(restRes.result, true);
  }

  protected async _post(entity: Partial<T>, uri?: string): Promise<T> {
    const restRes: IRestResponse<Partial<T>> = await this.httpService.post<Partial<T>>(
      uri ? uri : this.getParentUri(entity),
      entity,
      this.headers,
    );
    return this.getEntity(restRes.result, true);
  }

  protected async _delete(uri: string): Promise<void> {
    await this.httpService.delete(uri, this.headers);
    this.getCachedObject(uri)?.cleanAfterDeletion();
    this.getCachedObject(uri)?.removeFromCachedObject();
  }

  protected getParentUri(entity: Partial<T>): string {
    if (!this.parent) {
      return this.restUri;
    }
    return `${this.getEntityUri(this.parent, [
      entity[this.parent + 'Id'],
      this.camelToKebabCase(this.entityName) + 's',
    ])}`;
  }
}
