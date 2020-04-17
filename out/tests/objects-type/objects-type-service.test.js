"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var objects_type_service_1 = require("../../src/objects-type/objects-type-service");
describe('ObjectTypeSerice', function () {
    describe('getAll', function () {
        var objectsTypeService = new objects_type_service_1.ObjectsTypeService('http://127.0.0.1:3000/api/object-types');
        return objectsTypeService.getAll().then(function (list) {
            it('should return a non empty array', function () {
                expect(list).toBe([]);
            });
        });
    });
});
//# sourceMappingURL=objects-type-service.test.js.map