import {IRestEntity} from '@jacquesparis/objects-model';
import * as _ from 'lodash-es';

import {ErrorNoUpdateFunction} from '../errors/error-no-update-funtion';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {IRestEntityService} from './i-rest-entity.service';
export abstract class RestEntityImpl<T extends IEntityPropertiesWrapper<T>>
  implements IEntityPropertiesWrapper<T>, IRestEntity {
  set editionProperties(value: Partial<T>) {
    if (this.enableAutoSave) {
      this.updateEditionProperties(value);
    } else {
      this._editionProperties = value;
    }
  }
  get editionProperties(): Partial<T> {
    return this._editionProperties;
  }
  get entityProperties(): Partial<T> {
    return this._entityProperties;
  }

  set _editionProperties(value: Partial<T>) {
    const entityProperties = this.entityProperties;
    Object.keys(entityProperties).forEach(key => {
      if (!(key in value)) {
        if (_.isArray(entityProperties[key])) {
          this[key] = [];
        } else if (_.isObject(entityProperties[key])) {
          this[key] = {};
        } else {
          this[key] = null;
        }
      } else {
        if (_.isArray(value[key]) || _.isObject(value[key])) {
          this[key] = _.cloneDeep(value[key]);
        } else {
          this[key] = value[key];
        }
      }
    });
  }
  get _editionProperties(): Partial<T> {
    return _.cloneDeep(this.entityProperties);
  }
  public uri?: string;
  public id?: string;
  public enableAutoSave = true;
  // tslint:disable-next-line: variable-name
  protected abstract _entityProperties: Partial<T>;

  constructor(protected restEntityService: IRestEntityService<T>) {}

  public assign(value: Partial<T>): T {
    Object.assign(this, value);
    return (this as unknown) as T;
  }

  public async updateEditionProperties(properties: Partial<T>): Promise<void> {
    const fromEditionProperties = this._editionProperties;
    const fromEntityProperties = this._entityProperties;
    this._editionProperties = properties;
    try {
      await this.save(fromEntityProperties);
    } catch (error) {
      this._editionProperties = fromEditionProperties;
      throw error;
    }
  }

  public async save(from?: Partial<T>): Promise<void> {
    const to = this.entityProperties;
    if (this.id) {
      if (from && this.restEntityService.patch) {
        const patchProperties = this.makePatchProperties(from, to);
        if (0 < Object.keys(patchProperties).length) {
          await this.restEntityService.patch(this.uri, this.makePatchProperties(from, to));
        }
      } else if (this.restEntityService.put) {
        await this.restEntityService.put(this.uri, to);
      } else {
        throw new ErrorNoUpdateFunction<T>(this);
      }
    } else {
      if (this.restEntityService.post) {
        await this.restEntityService.post(this.entityProperties);
      }
    }
  }

  protected makePatchProperties(from: Partial<T>, to?: Partial<T>): Partial<T> {
    const entityProperties = to ? _.cloneDeep(to) : this.entityProperties;

    for (const key of Object.keys(from)) {
      if (!(key in entityProperties)) {
        entityProperties[key] = null;
      }
    }
    for (const key of Object.keys(entityProperties)) {
      if (key in from && _.isEqual(from[key], entityProperties[key])) {
        delete entityProperties[key];
      }
    }
    return entityProperties;
  }
}
