import * as _ from 'lodash-es';
export class RestTools {
  protected replaceInArray(entitiesArray: any[], entity?: any, remove = false, key = 'id') {
    const index = _.findIndex(entitiesArray, {[key]: entity[key]});
    if (index >= 0) {
      if (remove) {
        entitiesArray.splice(index, 1);
      } else {
        entitiesArray.splice(index, 1, entity);
      }
    } else if (!remove) {
      entitiesArray.push(entity);
    }
  }

  protected camelToKebabCase(str: string) {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
  }

  protected restUriFromEntityUri(uri) {
    const uriParts = uri.split('/');
    uriParts.pop();
    return uriParts.join('/');
  }
}
