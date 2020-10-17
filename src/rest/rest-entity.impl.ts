import {IRestEntity} from '@jacquesparis/objects-model';
import * as _ from 'lodash-es';

import {ErrorNoCreationFunction} from '../errors/error-no-creation-function';
import {ErrorNoDeletionFunction} from '../errors/error-no-deletion-function';
import {ErrorNoUpdateFunction} from '../errors/error-no-update-function';
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
    Object.keys(this.restEntityService.entityDefinition.properties).forEach(key => {
      if (!(key in value) || undefined === value[key] || null === value[key]) {
        if ('default' in this.restEntityService.entityDefinition.properties[key]) {
          this[key] = this.restEntityService.entityDefinition.properties[key].default;
        } else {
          switch (this.restEntityService.entityDefinition.properties[key].type) {
            case 'array':
              this[key] = [];
              break;
            case 'object':
              this[key] = {};
            default:
              this[key] = null;
              break;
          }
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
    const result = _.cloneDeep(this.entityProperties);
    Object.keys(this.restEntityService.entityDefinition.properties).forEach(key => {
      if (undefined === result[key] || null === result[key]) {
        if ('default' in this.restEntityService.entityDefinition.properties[key]) {
          result[key] = this.restEntityService.entityDefinition.properties[key].default;
        } else {
          switch (this.restEntityService.entityDefinition.properties[key].type) {
            case 'array':
              result[key] = [];
              break;
            case 'object':
              result[key] = {};
            default:
              break;
          }
        }
      }
    });
    return result;
  }
  public uri?: string;
  public id?: string;
  public enableAutoSave = true;
  // tslint:disable-next-line: variable-name
  protected abstract _entityProperties: Partial<T>;

  constructor(protected restEntityService: IRestEntityService<T>) {
    const properties: {
      [name: string]: any;
    } = this.restEntityService.entityDefinition.properties;
    Object.keys(properties).forEach(key => {
      if ('default' in properties[key]) {
        this[key] = properties[key].default;
      }
    });
  }
  get isNewEntity(): boolean {
    return !this.id;
  }

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
    if (!this.isNewEntity) {
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
    } else if (this.restEntityService.post) {
      if (this.restEntityService.post) {
        const createdImpl = await this.restEntityService.post(this.entityProperties);
        Object.assign(this, createdImpl);
      }
    } else {
      throw new ErrorNoCreationFunction<T>(this);
    }
  }

  public async delete(): Promise<void> {
    if (this.restEntityService.delete) {
      await this.restEntityService.delete(this.uri);
    } else {
      throw new ErrorNoDeletionFunction<T>(this);
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
