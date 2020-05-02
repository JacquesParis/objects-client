import {IObjectType} from '@jacquesparis/objects-model';
import {IEntityPropertiesWrapper} from '../model/i-entity-properties-wrapper';
import {ObjectSubTypeImpl} from '../object-sub-type/object-sub-type.impl';
import {ObjectSubTypesService} from '../object-sub-type/object-sub-types.service';
import {RestEntityImpl} from '../rest/rest-entity.impl';
import {ObjectTypesService} from './object-types.service';

export class ObjectTypeImpl extends RestEntityImpl<ObjectTypeImpl>
  implements IObjectType, IEntityPropertiesWrapper<ObjectTypeImpl> {
  public name: string;
  public type: string;
  public definition: any;
  public objectSubTypes: ObjectSubTypeImpl[] = [];
  public uri?: string;
  public id?: string;

  constructor(objectTypesService: ObjectTypesService) {
    super(objectTypesService);
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

  public assign(value: Partial<ObjectTypeImpl>): ObjectTypeImpl {
    super.assign(value);
    if (this.objectSubTypes) {
      const subTypes: ObjectSubTypeImpl[] = [];
      this.objectSubTypes.forEach(objectSubType => {
        subTypes.push(
          new ObjectSubTypeImpl(
            ObjectSubTypesService.getService(this.restEntityService.httpService, this.restEntityService.baseUri),
          ).assign(objectSubType),
        );
      });
      this.objectSubTypes = subTypes;
    }

    return this;
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
