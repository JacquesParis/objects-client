import {IRestService} from '../rest/i-rest.service';
export interface IOptionalServices {
  actionsLoggingService?: IActionsLoggingService;
}

export interface IActionsLoggingService {
  initAction(id: string): void;
  endAction(id: string): void;
}

export class ObjectClientConfigurationService {
  protected static instance: ObjectClientConfigurationService;

  protected constructor(
    protected httpService: IRestService,
    protected baseUri: string,
    protected optionalServices: IOptionalServices,
  ) {}

  public static get httpService(): IRestService {
    return this.instance ? this.instance.httpService : undefined;
  }
  public static get baseUri(): string {
    return this.instance ? this.instance.baseUri : undefined;
  }
  public static get optionalServices(): IOptionalServices {
    return this.instance ? this.instance.optionalServices : undefined;
  }
}
