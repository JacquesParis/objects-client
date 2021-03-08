import {IJsonSchema} from '@jacquesparis/objects-model';
import * as _ from 'lodash-es';
import {ObjectClientConfigurationService} from '../helper/object-client-configuration.service';
import {EntityName} from '../model/entity-name';
import {ObjectTypeImpl} from '../object-type/object-type.impl';
import {IRestEntityService} from '../rest/i-rest-entity.service';
import {IRestService} from '../rest/i-rest.service';
import {RestService} from '../rest/rest.service';
import {ObjectSubTypeImpl} from './object-sub-type.impl';
import {OBJECT_SUB_TYPE_SCHEMA} from './object-sub-type.schema';

export class ObjectSubTypesService extends RestService<ObjectSubTypeImpl>
  implements IRestEntityService<ObjectSubTypeImpl> {
  public static getService(
    httpService: IRestService = ObjectClientConfigurationService.httpService,
    baseUri: string = ObjectClientConfigurationService.baseUri,
  ) {
    if (!ObjectSubTypesService.SERVICE) {
      if (!httpService || !baseUri) {
        throw new Error('service not initialized');
      }
      ObjectSubTypesService.SERVICE = new ObjectSubTypesService(httpService, baseUri);
    }
    return ObjectSubTypesService.SERVICE;
  }
  protected static SERVICE: ObjectSubTypesService;
  protected constructor(httpService: IRestService, public baseUri: string) {
    super(
      EntityName.objectSubType,
      OBJECT_SUB_TYPE_SCHEMA,
      ObjectSubTypeImpl,
      httpService,
      baseUri,
      EntityName.objectType,
    );
  }

  public async patch(uri: string, objectType: Partial<ObjectSubTypeImpl>): Promise<ObjectSubTypeImpl> {
    return super._patch(uri, objectType);
  }

  public post(objectType: Partial<ObjectSubTypeImpl>): Promise<ObjectSubTypeImpl> {
    return this._post(objectType);
  }

  public delete(uri: string): Promise<void> {
    return super._delete(uri);
  }

  public getSchema(
    objectSubType: ObjectSubTypeImpl,
    objectTypeOwner: ObjectTypeImpl,
    allObjectTypes: ObjectTypeImpl[],
  ): IJsonSchema {
    const schema = _.cloneDeep(this.entityDefinition);
    schema.properties.subObjectTypeId.oneOf = [];
    allObjectTypes.forEach(availableObjectType => {
      schema.properties.subObjectTypeId.oneOf.push({
        enum: [availableObjectType.id],
        title:
          availableObjectType.name + (availableObjectType.contentType ? ' - ' + availableObjectType.contentType : ''),
      });
    });
    if (1 < objectTypeOwner.objectSubTypes.length) {
      const brothers = objectTypeOwner.objectSubTypes.filter(oneBrother => oneBrother.id !== objectSubType.id);

      schema.properties.exclusions.items = {
        type: 'string',
        title: 'exclusion',
        enum: [],
        enumNames: [],
      };
      schema.properties.mandatories.items = {
        type: 'string',
        title: 'exclusion',
        enum: [],
        enumNames: [],
      };
      brothers.forEach(brother => {
        schema.properties.exclusions.items.enum.push(brother.id);
        schema.properties.mandatories.items.enum.push(brother.id);
        schema.properties.exclusions.items.enumNames.push(brother.name);
        schema.properties.mandatories.items.enumNames.push(brother.name);
      });
    } else {
      delete schema.properties.exclusions;
      delete schema.properties.mandatories;
    }
    return schema;
  }
}
