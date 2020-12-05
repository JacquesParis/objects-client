import {IJsonSchema, IObjectSubType} from '@jacquesparis/objects-model';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {ObjectTypeImpl} from '../object-type/object-type.impl';
import {RestEntityImpl} from '../rest/rest-entity.impl';
import {ObjectTypesService} from './../object-type/object-types.service';
import {ObjectSubTypesService} from './object-sub-types.service';

export class ObjectSubTypeImpl extends RestEntityImpl<ObjectSubTypeImpl>
  implements IObjectSubType, IEntityPropertiesWrapper<ObjectSubTypeImpl> {
  protected get _entityProperties(): Partial<ObjectSubTypeImpl> {
    return {
      name: this.name,
      // tslint:disable-next-line: object-literal-sort-keys
      min: this.min,
      max: this.max,
      owner: this.owner,
      namespace: this.namespace,
      tree: this.tree,
      acl: this.acl,
      exclusions: this.exclusions,
      mandatories: this.mandatories,
      subObjectTypeId: this.subObjectTypeId,
      objectTypeId: this.objectTypeId,
    };
  }
  public name?: string;
  public index?: number;
  public min?: number;
  public max?: number;
  public owner?: boolean;
  public namespace?: boolean;
  public tree?: boolean;
  public acl?: boolean;
  public exclusions?: string[];
  public mandatories?: string[];
  public subObjectType?: ObjectTypeImpl;
  public subObjectTypeId: string;
  public subObjectTypeUri?: string;
  public objectType?: ObjectTypeImpl;
  public objectTypeId?: string;
  public objectTypeUri?: string;
  protected restEntityService: ObjectSubTypesService;

  public cleanAfterDeletion() {
    const objectSubTypeParent: ObjectTypeImpl = ObjectTypesService.getService().getCachedObjectById(this.objectTypeId);
    this.replaceInArray(objectSubTypeParent.objectSubTypes, this, true);
    super.cleanAfterDeletion();
  }

  public updateAfterCreation() {
    const objectSubTypeParent: ObjectTypeImpl = ObjectTypesService.getService().getCachedObjectById(this.objectTypeId);
    this.replaceInArray(objectSubTypeParent.objectSubTypes, this);
  }

  get entityDefinition(): IJsonSchema {
    let schema: IJsonSchema;
    if (this.entityCtx?.jsonSchema) {
      schema = this.entityCtx.jsonSchema;
    } else if (this.objectType) {
      schema = this.restEntityService.getSchema(
        this,
        this.objectType,
        ObjectTypesService.getService().getCachedObjects(),
      );
    } else {
      schema = this.restEntityService.entityDefinition;
    }
    return schema;
  }
}
