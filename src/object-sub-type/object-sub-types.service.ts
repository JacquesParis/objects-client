import * as _ from 'lodash-es';
import {EntityName} from '../model/entity-name';
import {IJsonSchema} from '../model/i-json-schema';
import {ObjectTypeImpl} from '../object-type/object-type.impl';
import {IRestEntityService} from '../rest/i-rest-entity.service';
import {IRestService} from '../rest/i-rest.service';
import {RestService} from '../rest/rest.service';
import {ObjectSubTypeImpl} from './object-sub-type.impl';

const OBJECT_SUB_TYPE_SCHEMA: IJsonSchema = {
  properties: {
    name: {
      type: 'string',
      title: 'Name of the relation to the sub-object',
    },

    subObjectTypeId: {
      type: 'string',
      title: 'Type of sub-object',
    },
    min: {
      type: 'number',
      title: 'Minimum number of child',
      minimum: 0,
      default: 0,
    },
    max: {
      type: 'number',
      title: 'Maximum number of child',
      default: Number.MAX_SAFE_INTEGER,
      maximum: Number.MAX_SAFE_INTEGER,
    },
    exclusions: {
      type: 'array',
      title: 'Incompatible sub types',
      items: {
        type: 'string',
      },
    },
    mandatories: {
      type: 'array',
      title: 'Mandatory sub types',
      items: {
        type: 'string',
      },
    },
  },
};

export class ObjectSubTypesService extends RestService<ObjectSubTypeImpl>
  implements IRestEntityService<ObjectSubTypeImpl> {
  public static getService(httpService: IRestService, baseUri: string) {
    if (!ObjectSubTypesService.SERVICE) {
      ObjectSubTypesService.SERVICE = new ObjectSubTypesService(httpService, baseUri);
    }
    return ObjectSubTypesService.SERVICE;
  }
  protected static SERVICE: ObjectSubTypesService;
  protected constructor(public httpService: IRestService, public baseUri: string) {
    super(
      EntityName.objectSubType,
      OBJECT_SUB_TYPE_SCHEMA,
      ObjectSubTypeImpl,
      httpService,
      baseUri,
      EntityName.objectType,
    );
  }

  public async patch(uri: string, objectType: Partial<ObjectSubTypeImpl>): Promise<void> {
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
        title: availableObjectType.name + ' - ' + availableObjectType.contentType,
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
