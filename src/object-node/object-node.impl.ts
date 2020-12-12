import {IObjectNode, IObjectType} from '@jacquesparis/objects-model';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {ObjectTreesService} from '../object-tree';
import {RestEntityImpl} from '../rest/rest-entity.impl';
import {IJsonSchema} from './../../lib/model/i-json-schema.d';
import {ObjectTypeImpl} from './../object-type/object-type.impl';
import {ObjectNodesService} from './object-nodes.service';

export class ObjectNodeImpl extends RestEntityImpl<ObjectNodeImpl>
  implements IObjectNode, IEntityPropertiesWrapper<ObjectNodeImpl> {
  protected get _entityProperties(): Partial<ObjectNodeImpl> {
    const retour = {
      name: this.name,
      // tslint:disable-next-line: object-literal-sort-keys
      objectTypeId: this.objectTypeId,
      parentNodeId: this.parentNodeId,
      parentOwnerId: this.parentOwnerId,
      parentACLId: this.parentACLId,
      owner: this.owner,
      namespace: this.namespace,
      tree: this.tree,
      acl: this.acl,
    };
    /*
    if (this.objectType && this.objectType.definition && this.objectType.definition.properties) {
      Object.keys(this.objectType.definition.properties).forEach(key => {
        retour[key] = this[key];
      });
    }
    if (this.objectType && this.objectType.contentDefinition && this.objectType.contentDefinition.properties) {
      Object.keys(this.objectType.contentDefinition.properties).forEach(key => {
        retour[key] = this[key];
      });
    }*/
    return retour;
  }
  public name: string;
  public objectType?: IObjectType;
  public parentNode?: IObjectNode;
  public parentOwner?: IObjectNode;
  public parentOwnerId?: string;
  public parentOwnerUr?: string;
  public parentACL?: IObjectNode;
  public parentACLId?: IObjectNode;
  public parentACLUri?: IObjectNode;
  public parentTree?: IObjectNode;
  public parentTreeId?: string;
  public parentTreeUri?: string;
  public owner?: boolean;
  public namespace?: boolean;
  public tree?: boolean;
  public acl?: boolean;
  public parentNodeId?: string;
  public parentNodeUri?: string;
  public objectTypeId?: string;
  public objectTypeUri?: string;
  protected restEntityService: ObjectNodesService;

  get entityDefinition(): IJsonSchema {
    let schema: IJsonSchema;
    if (this.entityCtx?.jsonSchema) {
      schema = this.entityCtx.jsonSchema;
    } else if (this.objectType) {
      schema = this.restEntityService.getSchema((this.objectType as unknown) as ObjectTypeImpl);
    } else {
      schema = this.restEntityService.entityDefinition;
    }
    return schema;
  }

  public cleanAfterDeletion() {
    const parentTree = ObjectTreesService.getService().getCachedObjectById(this.parentNodeId);
    const tree = ObjectTreesService.getService().getCachedObjectById(this.id);
    this.replaceInArray(parentTree.children, tree, true);
    parentTree.notifyChanges();
    super.cleanAfterDeletion();
  }

  public updateAfterCreation() {
    ObjectTreesService.getService().get(ObjectTreesService.getService().getUri(this.parentTreeId as string));
  }
}
