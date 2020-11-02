import {IRestEntity} from '@jacquesparis/objects-model';
import * as _ from 'lodash-es';
import {RestTools} from './rest-tools';

import {ErrorNoCreationFunction} from '../errors/error-no-creation-function';
import {ErrorNoDeletionFunction} from '../errors/error-no-deletion-function';
import {ErrorNoUpdateFunction} from '../errors/error-no-update-function';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {IRestEntityService} from './i-rest-entity.service';
export abstract class RestEntityImpl<T extends IEntityPropertiesWrapper<T>> extends RestTools
  implements IEntityPropertiesWrapper<T>, IRestEntity {
  get entityDefinition() {
    return this.restEntityService.entityDefinition;
  }

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
    Object.keys(this.entityDefinition.properties).forEach(key => {
      if (!(key in value) || undefined === value[key] || null === value[key]) {
        if ('default' in this.entityDefinition.properties[key]) {
          this[key] = this.entityDefinition.properties[key].default;
        } else {
          switch (this.entityDefinition.properties[key].type) {
            case 'array':
              this[key] = [];
              break;
            case 'object':
            case 'file':
              this[key] = {};
            default:
              this[key] = null;
              break;
          }
        }
      } else {
        if ('File' === value[key]?.constructor?.name) {
          this[key] = value[key];
        } else if (_.isArray(value[key]) || _.isObject(value[key])) {
          this[key] = _.cloneDeep(value[key]);
        } else {
          this[key] = value[key];
        }
      }
    });
  }
  get _editionProperties(): Partial<T> {
    const result = _.cloneDeep(this.entityProperties);
    Object.keys(this.entityDefinition.properties).forEach(key => {
      if (undefined === result[key] || null === result[key]) {
        if ('default' in this.entityDefinition.properties[key]) {
          result[key] = this.entityDefinition.properties[key].default;
        } else {
          switch (this.entityDefinition.properties[key].type) {
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
  public updatedId: string = '' + Math.ceil(Math.random() * 100000000000000);
  public enableAutoSave = true;
  // tslint:disable-next-line: variable-name
  protected abstract _entityProperties: Partial<T>;
  protected restEntityService: IRestEntityService<T>;

  constructor(restEntityService: IRestEntityService<T>, values?: Partial<T>) {
    super();
    this.restEntityService = restEntityService;
    const properties: {
      [name: string]: any;
    } = this.entityDefinition.properties;
    Object.keys(properties).forEach(key => {
      if ('default' in properties[key]) {
        this[key] = properties[key].default;
      }
    });
    if (values) {
      this.assign(values);
    }
    this.updateReferences();
  }
  get isNewEntity(): boolean {
    return !this.id;
  }

  public assign(value: Partial<T>): T {
    Object.assign(this, value);
    this.updateReferences();
    return (this as unknown) as T;
  }

  // tslint:disable-next-line: no-empty
  public cleanAfterDeletion() {}

  // tslint:disable-next-line: no-empty
  public updateAfterCreation() {}

  public get isReady(): boolean {
    return !this._loadContent;
  }
  public async waitForReady(): Promise<void> {
    if (this._loadContent) {
      await this._loadContent();
    }
  }
  public updateReferences() {
    if (this.uri) {
      this.restEntityService.storeInCachedObject(this);
    }
    Object.keys(this).forEach(key => {
      if (key.endsWith('Uri') && _.isString(this[key]) && this.restEntityService.getCachedObject(this[key])) {
        this[key.substr(0, key.length - 3)] = this.restEntityService.getCachedObject(this[key]);
      }
    });
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
          this.storeInCachedObject();
          await this.restEntityService.patch(this.uri, this.makePatchProperties(from, to));
        }
      } else if (this.restEntityService.put) {
        this.storeInCachedObject();
        await this.restEntityService.put(this.uri, to);
      } else {
        throw new ErrorNoUpdateFunction<T>(this);
      }
    } else if (this.restEntityService.post) {
      if (this.restEntityService.post) {
        const createdImpl = await this.restEntityService.post(this.entityProperties);
        Object.assign(this, createdImpl);
        this.updateAfterCreation();
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

  public storeInCachedObject() {
    this.restEntityService.storeInCachedObject(this);
  }
  public removeFromCachedObject() {
    this.restEntityService.removeFromCachedObject(this);
  }

  protected _loadContent?(): Promise<void>;

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
