export interface IJsonSchema {
  properties: {
    [name: string]: any;
  };
  [otherKey: string]: any;
}
