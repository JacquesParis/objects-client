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
  protected _entityProperties: Partial<ObjectTreeImpl> = {};

  public childrenByType(objectTypeId) {
    return this.children.filter(tree => tree.treeNode.objectTypeId === objectTypeId);
  }

  public assign(value: Partial<ObjectTreeImpl>): ObjectTreeImpl {
    super.assign(value);
    if (!this.children) {
      this.children = [];
    }
    if (this.treeNode) {
      this.treeNode = new ObjectNodeImpl(ObjectNodesService.getService(), this.treeNode);
      if (this.children) {
        for (const index of Object.keys(this.children)) {
          this.children[index] = new ObjectTreeImpl(this.restEntityService, this.children[index]);
        }
      }
      if (!this.id) {
        this.id = this.treeNode.id;
      }
      this.storeInCachedObject();
      if (this.uri) {
        this._loadContent = this.loadSubTree.bind(this);
      }
    }
    return this;
  }
  protected async loadSubTree(): Promise<void> {
    delete this._loadContent;
    await this.restEntityService.get(this.uri);
  }
}