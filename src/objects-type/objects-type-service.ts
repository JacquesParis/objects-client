import {IRestService} from '../rest/i-rest-service';
import {RestService} from '../rest/rest-service';
import {ObjectTypeImpl} from './object-type.impl';

export class ObjectsTypeService extends RestService<ObjectTypeImpl> {
  constructor(protected httpService: IRestService, protected server: string) {
    super(ObjectTypeImpl, httpService, server);
  }

  public async get(uri: string): Promise<ObjectTypeImpl> {
    return super._get(uri);
  }
  public async getAll(): Promise<ObjectTypeImpl[]> {
    return super._getAll({
      filter: {
        fields: {
          definition: true,
          id: true,
          name: true,
          type: true,
          uri: true,
        },
        include: [
          {
            relation: 'objectSubTypes',
          },
        ],
      },
    });
  }

  public async put(objectType: ObjectTypeImpl): Promise<void> {
    return super._put(objectType.uri, objectType.entityProperties);
  }
}
