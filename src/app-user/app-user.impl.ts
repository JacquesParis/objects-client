import {IAppUser} from '@jacquesparis/objects-model';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {RestEntityImpl} from '../rest/rest-entity.impl';
import {AppUserService} from './app-user.service';

export class AppUserImpl extends RestEntityImpl<AppUserImpl>
  implements IAppUser, IEntityPropertiesWrapper<AppUserImpl> {
  protected get _entityProperties(): Partial<AppUserImpl> {
    return {
      email: this.email,
      name: this.name,
      firstname: this.firstname,
      lastname: this.lastname,
      password: this.password,
    };
  }
  public email: string;
  public name?: string;
  public firstname?: string;
  public lastname?: string;
  public password?: string;
  public token?: string;
  constructor(appUserService: AppUserService) {
    super(appUserService, {});
  }
}
