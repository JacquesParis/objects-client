import { ObjectsTypeService } from '../../src/objects-type/objects-type-service';

describe('ObjectTypeSerice', () => {
    describe('getAll', () => {
        const objectsTypeService: ObjectsTypeService = new ObjectsTypeService('http://127.0.0.1:3000/api/object-types');
        return objectsTypeService.getAll().then((list) => {
            it('should return a non empty array', () => {
                expect(list).toBe([]);
            });

        });
    });
});