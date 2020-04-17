import { ObjectsTypeService } from './objects-type/objects-type-service';
// tslint:disable-next-line: no-console
console.log('coucou');

const objectsTypeService: ObjectsTypeService = new ObjectsTypeService('http://127.0.0.1:3000/api/object-types');

objectsTypeService.getAll().then((list) => {
    console.log(list);
});