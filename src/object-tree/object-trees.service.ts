import {EntityName} from '../model/entity-name';
import {IRestEntityService} from '../rest/i-rest-entity.service';
import {IRestService} from '../rest/i-rest.service';
import {RestService} from '../rest/rest.service';
import {ObjectTreeImpl} from './object-tree.impl';

export class ObjectTreesService extends RestService<ObjectTreeImpl> implements IRestEntityService<ObjectTreeImpl> {
  public static getService(httpService?: IRestService, baseUri?: string) {
    if (!ObjectTreesService.SERVICE) {
      if (!httpService || !baseUri) {
        throw new Error('service not initialized');
      }
      ObjectTreesService.SERVICE = new ObjectTreesService(httpService, baseUri);
    }
    return ObjectTreesService.SERVICE;
  }
  protected static SERVICE: ObjectTreesService;

  protected constructor(public httpService: IRestService, public baseUri: string) {
    super(EntityName.objectTree, {properties: {}}, ObjectTreeImpl, httpService, baseUri);
  }

  public async get(uri: string): Promise<ObjectTreeImpl> {
    const previousTree = this.getCachedObject(uri);
    const tree = await super._get(uri);
    if (previousTree) {
      previousTree.treeNode.assign(tree.treeNode);
      previousTree.children = tree.children;
      this.storeInCachedObject(previousTree);
      //      this.replaceInArray(parentTree.children, tree);
      return previousTree;
    }
    return tree;
  }

  public async getRootTree(
    ownerType: string,
    ownerName: string,
    namespaceType?: string,
    namespaceName?: string,
    treeType?: string,
    treeName?: string,
  ): Promise<ObjectTreeImpl> {
    return super._get(
      this.getEntityUri(
        EntityName.objectTree,
        treeType
          ? ['tree', ownerType, ownerName, namespaceType, namespaceName, treeType, treeName]
          : namespaceType
          ? ['namespace', ownerType, ownerName, namespaceType, namespaceName]
          : ['owner', ownerType, ownerName],
      ),
    );
  }
}