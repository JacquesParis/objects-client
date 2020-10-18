import {IObjectNode, IObjectType} from '@jacquesparis/objects-model';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {RestEntityImpl} from '../rest/rest-entity.impl';
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
    if (this.objectType && this.objectType.definition && this.objectType.definition.properties) {
      Object.keys(this.objectType.definition.properties).forEach(key => {
        retour[key] = this[key];
      });
    }
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
  public owner?: boolean;
  public namespace?: boolean;
  public tree?: boolean;
  public acl?: boolean;
  public parentNodeId?: string;
  public parentNodeUri?: string;
  public objectTypeId?: string;
  public objectTypeUri?: string;
  protected restEntityService: ObjectNodesService;

  constructor(
    objectNodesService: ObjectNodesService,
    parentNodeId?: string,
    parentNodeUri?: string,
    objectTypeId?: string,
    objectTypeUri?: string,
  ) {
    super(objectNodesService, {parentNodeId, parentNodeUri, objectTypeId, objectTypeUri});
  }

  get entityDefinition() {
    if (this.objectType) {
      return this.restEntityService.getSchema((this.objectType as unknown) as ObjectTypeImpl);
    }
    return this.restEntityService.entityDefinition;
  }
}
