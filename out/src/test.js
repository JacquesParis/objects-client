"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var objects_type_service_1 = require("./objects-type/objects-type-service");
// tslint:disable-next-line: no-console
console.log('coucou');
var objectsTypeService = new objects_type_service_1.ObjectsTypeService('http://127.0.0.1:3000/api/object-types');
objectsTypeService.getAll().then(function (list) {
    console.log(list);
});
//# sourceMappingURL=test.js.map