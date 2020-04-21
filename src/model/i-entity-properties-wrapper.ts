import {IRestEntity} from '@jacquesparis/objects-model';
export interface IEntityPropertiesWrapper<T extends IRestEntity> extends IRestEntity {
  entityProperties: Partial<T>;
  editionProperties: Partial<T>;
  enableAutoSave: boolean;
  updateEditionProperties(properties: Partial<T>): Promise<void>;
  save(from?: Partial<T>): Promise<void>;
}
