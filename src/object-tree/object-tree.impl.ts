import {IObjectTree} from '@jacquesparis/objects-model';
import {IRestEntityService} from '../rest/i-rest-entity.service';
import {RestEntityImpl} from '../rest/rest-entity.impl';
import {IEntityPropertiesWrapper} from './../model/i-entity-properties-wrapper';
import {ObjectNodeImpl} from './../object-node/object-node.impl';
import {ObjectNodesService} from './../object-node/object-nodes.service';

export class ObjectTreeImpl extends RestEntityImpl<ObjectTreeImpl>
  implements IObjectTree, IEntityPropertiesWrapper<ObjectTreeImpl> {
  public children: ObjectTreeImpl[];
  public parentTree: ObjectTreeImpl;
  public treeNode: ObjectNodeImpl;

  public ownerType?: string;
  public ownerName?: string;
  public namespaceType?: string;
  public namespaceName?: string;
  public treeType?: string;
  public treeName?: string;

  protected _entityProperties: Partial<ObjectTreeImpl> = {};

  public childrenByType(objectTypeId) {
    return this.children.filter(tree => tree.treeNode.objectTypeId === objectTypeId);
  }

  public assign(value: Partial<ObjectTreeImpl>): ObjectTreeImpl {
    super.assign(value);
    if (!this.children) {
      this.children = [];
    }
    return this;
  }
}
