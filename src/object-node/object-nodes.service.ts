import {IJsonSchema} from '@jacquesparis/objects-model';
import * as _ from 'lodash-es';
import {IRestEntityService} from '../rest/i-rest-entity.service';
import {IRestResponse} from '../rest/i-rest.service';
import {IRestService} from '../rest/i-rest.service';
import {RestFullService} from '../rest/rest-full.service';
import {EntityName} from './../model/entity-name';
import {ObjectTypeImpl} from './../object-type/object-type.impl';
import {ObjectNodeImpl} from './object-node.impl';
import {OBJECT_NODE_SCHEMA} from './object-node.schema';

export class ObjectNodesService extends RestFullService<ObjectNodeImpl> implements IRestEntityService<ObjectNodeImpl> {
  public static getService(httpService?: IRestService, baseUri?: string) {
    if (!ObjectNodesService.SERVICE) {
      if (!httpService || !baseUri) {
        throw new Error('service not initialized');
      }
      ObjectNodesService.SERVICE = new ObjectNodesService(httpService, baseUri);
    }
    return ObjectNodesService.SERVICE;
  }
  protected static SERVICE: ObjectNodesService;
  public formDataExtention = 'multipart/';

  protected constructor(public httpService: IRestService, public baseUri: string) {
    super(EntityName.objectNode, OBJECT_NODE_SCHEMA, ObjectNodeImpl, httpService, baseUri);
  }

  public async getAll(
    ownerType: string,
    ownerName: string,
    namespaceType?: string,
    namespaceName?: string,
    treeType?: string,
    treeName?: string,
  ): Promise<ObjectNodeImpl[]> {
    const restRes: IRestResponse<ObjectNodeImpl[]> = await this.httpService.get<ObjectNodeImpl[]>(
      this.getEntityUri(
        EntityName.objectTree,
        treeType
          ? ['tree', ownerType, ownerName, namespaceType, namespaceName, treeType, treeName, 'nodes']
          : namespaceType
          ? ['namespace', ownerType, ownerName, namespaceType, namespaceName, 'nodes']
          : ['owner', ownerType, ownerName, 'nodes'],
      ),
    );
    const res: ObjectNodeImpl[] = [];
    restRes.result.forEach(oneResult => {
      res.push(this.getEntity(oneResult));
    });
    return res;
  }

  public async getChilds(treeId: string) {
    const restRes: IRestResponse<ObjectNodeImpl[]> = await this.httpService.get<ObjectNodeImpl[]>(
      this.getEntityUri(EntityName.objectTree, [treeId, 'nodes']),
    );
    const res: ObjectNodeImpl[] = [];
    restRes.result.forEach(oneResult => {
      res.push(this.getEntity(oneResult));
    });
    return res;
  }
  public getSchema(objectType: ObjectTypeImpl): IJsonSchema {
    const schema = _.merge(
      {},
      this.entityDefinition,
      objectType.definition,
      this.entityDefinition,
      objectType.contentDefinition,
    );

    return schema;
  }
}
