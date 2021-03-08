import {omit} from 'lodash-es';
import {ObjectClientConfigurationService} from '../helper/object-client-configuration.service';
import {IRestEntityService} from '../rest/i-rest-entity.service';
import {RestFullService} from '../rest/rest-full.service';
import {EntityName} from './../model/entity-name';
import {IRestService} from './../rest/i-rest.service';
import {RestService} from './../rest/rest.service';
import {AppUserImpl} from './app-user.impl';
import {APP_USER_SCHEMA} from './app-user.schema';

export class AppUserService extends RestFullService<AppUserImpl> implements IRestEntityService<AppUserImpl> {
  public static getService(
    httpService: IRestService = ObjectClientConfigurationService.httpService,
    baseUri: string = ObjectClientConfigurationService.baseUri,
  ) {
    if (!AppUserService.SERVICE) {
      if (!httpService || !baseUri) {
        throw new Error('service not initialized');
      }
      AppUserService.SERVICE = new AppUserService(httpService, baseUri);
    }
    return AppUserService.SERVICE;
  }
  protected static SERVICE: AppUserService;
  private _user: AppUserImpl;

  protected constructor(httpService: IRestService, public baseUri: string) {
    super(EntityName.appUser, APP_USER_SCHEMA, AppUserImpl, httpService, baseUri);
  }

  public async login(credentials: {email: string; password: string}): Promise<AppUserImpl> {
    const result = await this._post(credentials, this.getEntityUri(EntityName.appUser, ['login']));
    RestService.setAuthToken(result.token);
    this._user = omit(result, 'token');
    return result;
  }

  public async me(): Promise<AppUserImpl> {
    this._user = null;
    try {
      this._user = await this._get(this.getEntityUri(EntityName.appUser, ['me']));
    } catch (error) {
      RestService.setAuthToken(undefined);
      throw error;
    }
    return this._user;
  }

  public async register(appUser: Partial<AppUserImpl>): Promise<AppUserImpl> {
    return this._post(appUser);
  }

  public async isUserLoguedIn(): Promise<boolean | AppUserImpl> {
    if (undefined === RestService.authToken) {
      return false;
    } else if (!this._user) {
      try {
        return await this.me();
      } catch (error) {
        return false;
      }
    }
    return this._user;
  }

  public async logout(): Promise<void> {
    RestService.setAuthToken(undefined);
  }
}
