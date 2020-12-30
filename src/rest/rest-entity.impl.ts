import {IEntityContext, IEntityMethod, IRestEntity} from '@jacquesparis/objects-model';
import * as _ from 'lodash-es';
import {ErrorNoCreationFunction} from '../errors/error-no-creation-function';
import {ErrorNoDeletionFunction} from '../errors/error-no-deletion-function';
import {ErrorNoUpdateFunction} from '../errors/error-no-update-function';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {IRestEntityService} from './i-rest-entity.service';
import {RestTools} from './rest-tools';
import {RestService} from './rest.service';

export abstract class RestEntityImpl<T extends IEntityPropertiesWrapper<T>> extends RestTools
  implements IEntityPropertiesWrapper<T>, IRestEntity {
  public REST_ENTITY = true;
  [key: string]: any;
  public entityCtx?: IEntityContext;
  public aliasUri?: string;

  get entityDefinition() {
    if (this.entityCtx?.jsonSchema) {
      return this.entityCtx?.jsonSchema;
    }
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
    const properties: object = this._entityProperties;
    if (this.entityCtx?.jsonSchema?.properties) {
      for (const propertyKey of Object.keys(this.entityCtx.jsonSchema.properties)) {
        properties[propertyKey] = this[propertyKey];
      }
    }
    return properties;
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
  public get isNewEntity(): boolean {
    return !this.id;
  }

  public get isReady(): boolean {
    return !this._loadContent;
  }
  public uri?: string;
  public id?: string;
  public updatedId: string = '' + Math.ceil(Math.random() * 100000000000000);
  public enableAutoSave = true;
  // tslint:disable-next-line: variable-name
  protected abstract _entityProperties: Partial<T>;
  protected restEntityService: IRestEntityService<T>;
  private subscribers: {[key: number]: () => void} = {};
  // private loadedFunctionAlreadySet = false;
  private onGoingPromise: Promise<void>;

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

  public onChange(subscriber: () => void): () => void {
    const id = Math.ceil(Math.random() * 100000000000000000000000);
    this.subscribers[id] = subscriber;
    return () => {
      delete this.subscribers[id];
    };
  }

  public assign(value: Partial<T>, notifyChanges = true): T {
    Object.assign(this, value);

    for (const key of Object.keys(this)) {
      if (_.isArray(this[key])) {
        for (const index of Object.keys(this[key])) {
          if (_.isObject(this[key][index]) && this[key][index].entityCtx?.entityType && !this[key].REST_ENTITY) {
            this[key][index] = RestService.getEntityService(this[key][index].entityCtx.entityType).getEntity(
              this[key][index],
            );
          }
        }
      } else if (_.isObject(this[key]) && !this[key].REST_ENTITY && this[key].entityCtx?.entityType) {
        this[key] = RestService.getEntityService(this[key].entityCtx.entityType).getEntity(this[key]);
      }
    }
    /*
    this.treeNode = ObjectNodesService.getService().getEntity(this.treeNode);
      if (this.children) {
        for (const index of Object.keys(this.children)) {
          if (!this.children[index].id) {
            this.children[index].id = this.children[index].treeNode?.id;
          }
          this.children[index] = this.restEntityService.getEntity(this.children[index]);
        }
      }*/

    this.updateReferences(notifyChanges);
    return (this as unknown) as T;
  }

  // tslint:disable-next-line: no-empty
  public cleanAfterDeletion() {}

  // tslint:disable-next-line: no-empty
  public updateAfterCreation() {}
  public async waitForReady(): Promise<void> {
    if (this._loadContent) {
      this.onGoingPromise = this._loadContent();
      return this.onGoingPromise;
    } else if (this.onGoingPromise) {
      return this.onGoingPromise;
    }
  }

  public recursiveUpdateReferences(recursiveUris: string[] = []) {
    if (this.uri && -1 === _.indexOf(recursiveUris, this.uri)) {
      recursiveUris.push(this.uri);
      for (const key of Object.keys(this)) {
        if (_.isArray(this[key])) {
          for (const subEntity of this[key]) {
            if (subEntity.recursiveUpdateReferences) {
              subEntity.recursiveUpdateReferences(recursiveUris);
            }
          }
        } else if (_.isObject(this[key]) && this[key].recursiveUpdateReferences) {
          this[key].recursiveUpdateReferences(recursiveUris);
        } else if (key.endsWith('Uri') && _.isString(this[key]) && this.restEntityService.getCachedObject(this[key])) {
          this[key.substr(0, key.length - 3)] = this.restEntityService.getCachedObject(this[key]);
        }
      }
    }
  }

  // tslint:disable-next-line: no-empty
  public updateAfterAction() {}

  public async runAction(methodId: string, args): Promise<any> {
    const uri = this.uri + '/method/' + methodId;
    const result = await this.restEntityService.runAction(uri, args);

    this.updateAfterAction();
    return result;
  }

  public updateReferences(notifyChanges = true) {
    if (this.uri) {
      this.restEntityService.storeInCachedObject(this);
      if (this.entityCtx?.loaded === false) {
        this.setLoadContentFunction(this.loadEntity.bind(this));
      } else {
        this.setContentLoaded();
      }
    }

    this.recursiveUpdateReferences();
    if (this.notifyChanges) {
      this.notifyChanges();
    }
  }

  public notifyChanges() {
    for (const key of Object.keys(this.subscribers)) {
      this.subscribers[key]();
    }
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

  public setContentLoaded() {
    delete this._loadContent;
  }

  protected async loadEntity(): Promise<void> {
    this.setContentLoaded();
    try {
      await this.restEntityService.get(this.uri);
    } catch (error) {
      this.setLoadContentFunction(this.loadEntity.bind(this));
    }
  }
  protected setLoadContentFunction(loadFunction: () => Promise<void>): void {
    // if (!this.loadedFunctionAlreadySet) {
    // this.loadedFunctionAlreadySet = true;
    this._loadContent = loadFunction;
    // }
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

  private _loadContent?(): Promise<void>;
}
