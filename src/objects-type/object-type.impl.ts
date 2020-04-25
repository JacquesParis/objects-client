import {IObjectSubType, IObjectType} from '@jacquesparis/objects-model';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {RestEntityImpl} from '../rest/rest-entity.impl';
import {ObjectsTypeService} from './objects-type-service';

export class ObjectTypeImpl extends RestEntityImpl<ObjectTypeImpl>
  implements IObjectType, IEntityPropertiesWrapper<ObjectTypeImpl> {
  public name: string;
  public type: string;
  public definition: any;
  public objectSubTypes: IObjectSubType[];
  public uri?: string;
  public id?: string;

  constructor(objectsTypeService: ObjectsTypeService) {
    super(objectsTypeService);
  }
  get definitionString(): string {
    return JSON.stringify(this.definition, undefined, 2);
  }
  set definitionString(value: string) {
    try {
      this.definition = JSON.parse(value);
      // tslint:disable-next-line: no-empty
    } catch (error) {}
  }

  get _entityProperties(): Partial<ObjectTypeImpl> {
    return {
      name: this.name,
      type: this.type,
      // tslint:disable-next-line: object-literal-sort-keys
      definition: this.definition,
    };
  }
}
