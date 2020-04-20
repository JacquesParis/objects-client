import {IRestEntity} from '@jacquesparis/objects-model';
import * as _ from 'lodash';

import {ErrorNoUpdteFunction} from '../errors/error-no-update-funtion';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {IRestEntityService} from './i-rest-entity-service';
export abstract class RestEntityImpl<T extends IEntityPropertiesWrapper<T>>
  implements IEntityPropertiesWrapper<T>, IRestEntity {
  public uri?: string;
  public id?: string;
  public enableAutoSave = true;
  // tslint:disable-next-line: variable-name
  protected abstract _entityProperties: Partial<T>;
  // tslint:disable-next-line: variable-name
  protected abstract _editionProperties: Partial<T>;
  constructor(protected restEntityService: IRestEntityService<T>) {}

  public makePatchProperties(from: Partial<T>): Partial<T> {
    const entityProperties = this.entityProperties;

    for (const key of Object.keys(from)) {
      if (!(key in entityProperties)) {
        entityProperties[key] = null;
      }
    }
    for (const key of Object.keys(entityProperties)) {
      if (key in from && _.equals(from[key], entityProperties[key])) {
        delete entityProperties[key];
      }
    }
    return entityProperties;
  }

  public async save(from?: Partial<T>): Promise<void> {
    if (this.id) {
      if (from && this.restEntityService.patch) {
        await this.restEntityService.patch(this.uri, this.makePatchProperties(from));
      } else if (this.restEntityService.put) {
        await this.restEntityService.put(this.uri, this.entityProperties);
      } else {
        throw new ErrorNoUpdteFunction<T>(this);
      }
    } else {
      if (this.restEntityService.post) {
        await this.restEntityService.post(this.entityProperties);
      }
    }
  }

  set editionProperties(value: Partial<T>) {
    this._editionProperties = value;
    if (this.enableAutoSave) {
      this.save();
    }
  }
  get editionProperties(): Partial<T> {
    return this._editionProperties;
  }
  get entityProperties(): Partial<T> {
    return this._entityProperties;
  }
}
