import {IObjectSubType, IObjectType} from '@jacquesparis/objects-model';

export class ObjectTypeImpl implements IObjectType {
  public name: string;
  public type: string;
  public definition: any;
  public objectSubTypes: IObjectSubType[];
  public uri?: string;
  public id?: string;
  get definitionString(): string {
    return JSON.stringify(this.definition, undefined, 2);
  }
  set definitionString(value: string) {
    try {
      this.definition = JSON.parse(value);
      // tslint:disable-next-line: no-empty
    } catch (error) {}
  }

  get entityProperties(): Partial<ObjectTypeImpl> {
    return {
      name: this.name,
      type: this.type,
      // tslint:disable-next-line: object-literal-sort-keys
      definition: this.definition,
    };
  }
}
