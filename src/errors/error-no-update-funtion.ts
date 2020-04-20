import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {RestEntityImpl} from '../rest/rest-entity.impl';
import {ErrorOjectsClient} from './error-objects-client';
export class ErrorNoUpdteFunction<T extends IEntityPropertiesWrapper<T>> extends ErrorOjectsClient {
  constructor(entity: RestEntityImpl<T>) {
    super(`${entity.constructor.name} has not been initialized yet`, [entity.constructor.name]);
  }
}
