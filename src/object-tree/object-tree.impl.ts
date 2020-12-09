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
    super.assign(value, false);
    if (!this.children) {
      this.children = [];
    }
    /*
    if (this.treeNode) {
      this.treeNode = ObjectNodesService.getService().getEntity(this.treeNode);
      if (this.children) {
        for (const index of Object.keys(this.children)) {
          if (!this.children[index].id) {
            this.children[index].id = this.children[index].treeNode?.id;
          }
          this.children[index] = this.restEntityService.getEntity(this.children[index]);
        }
      }
      if (!this.id) {
        this.id = this.treeNode.id;
      }
      this.storeInCachedObject();
    }
    this.notifyChanges();*/
    return this;
  }
  /*
  protected async loadSubTree(): Promise<void> {
    this.setContentLoaded();
    await this.restEntityService.get(this.uri);
  }*/
}
