import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {RestEntityImpl} from '../rest/rest-entity.impl';
import {ErrorObjectsClient} from './error-objects-client';
export class ErrorNoUpdateFunction<T extends IEntityPropertiesWrapper<T>> extends ErrorObjectsClient {
  constructor(entity: RestEntityImpl<T>) {
    super(`${entity.constructor.name} has not been initialized yet`, [entity.constructor.name]);
  }
}
