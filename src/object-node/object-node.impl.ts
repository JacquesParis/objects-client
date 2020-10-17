import {IObjectNode, IObjectType} from '@jacquesparis/objects-model';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {RestEntityImpl} from '../rest/rest-entity.impl';
import {ObjectNodesService} from './object-nodes.service';

export class ObjectNodeImpl extends RestEntityImpl<ObjectNodeImpl>
  implements IObjectNode, IEntityPropertiesWrapper<ObjectNodeImpl> {
  protected get _entityProperties(): Partial<ObjectNodeImpl> {
    return {
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

  constructor(
    objectNodesService: ObjectNodesService,
    public parentNodeId?: string,
    public parentNodeUri?: string,
    public objectTypeId?: string,
    public objectTypeUri?: string,
  ) {
    super(objectNodesService);
  }
}
