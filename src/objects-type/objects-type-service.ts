import { IObjectType } from '@jacquesparis/objects-model';
import { RestService } from '../rest/rest-service';

export class ObjectsTypeService extends RestService<IObjectType> {
  constructor(protected server: string) {
    super(server);
  }

  public async get(uri: string): Promise<IObjectType> {
    return super.get(uri);
  }
  public async getAll(): Promise<IObjectType[]> {
    return super.getAll({
      filter: {
        fields: {
          definition: true,
          id: true,
          name: true,
          type: true,
          uri: true
        },
        include: [
          {
            relation: "objectSubTypes"
          }
        ]
      }
    });
  }
}
