import {IRestEntity} from '@jacquesparis/objects-model';

export interface IEntityPropertiesWrapper<T extends IRestEntity> extends IRestEntity {
  entityProperties: Partial<T>;
  editionProperties: Partial<T>;
  enableAutoSave: boolean;
  isNewEntity: boolean;
  isReady: boolean;
  updateEditionProperties(properties: Partial<T>): Promise<void>;
  save(from?: Partial<T>): Promise<void>;
  delete(): Promise<void>;
  assign(value: Partial<T>): T;
  waitForReady(): Promise<void>;
}
