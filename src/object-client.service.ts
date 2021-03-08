import {AppUserService} from './app-user/app-user.service';
import {IOptionalServices, ObjectClientConfigurationService} from './helper/object-client-configuration.service';
import {ObjectNodesService} from './object-node/object-nodes.service';
import {ObjectSubTypesService} from './object-sub-type/object-sub-types.service';
import {ObjectTreesService} from './object-tree/object-trees.service';
import {ObjectTypesService} from './object-type/object-types.service';
import {IRestService} from './rest/i-rest.service';

export class ObjectClientService extends ObjectClientConfigurationService {
  public static init(
    httpService: IRestService,
    baseUri: string,
    optionalServices: IOptionalServices,
  ): ObjectClientService {
    ObjectClientService.instance = new ObjectClientService(httpService, baseUri, optionalServices);
    ObjectClientConfigurationService.instance = ObjectClientService.instance;

    ObjectTypesService.getService();
    ObjectSubTypesService.getService();
    ObjectNodesService.getService();
    ObjectTreesService.getService();
    AppUserService.getService();
    return ObjectClientService.instance;
  }
  protected static instance: ObjectClientService;

  protected constructor(
    protected httpService: IRestService,
    protected baseUri: string,
    protected optionalServices: IOptionalServices,
  ) {
    super(httpService, baseUri, optionalServices);
  }

  public get objectTypesService(): ObjectTypesService {
    return ObjectTypesService.getService();
  }

  public get objectSubTypesService(): ObjectSubTypesService {
    return ObjectSubTypesService.getService();
  }

  public get objectNodeService(): ObjectNodesService {
    return ObjectNodesService.getService();
  }

  public get objectTreeService(): ObjectTreesService {
    return ObjectTreesService.getService();
  }

  public get appUserService(): AppUserService {
    return AppUserService.getService();
  }
}
