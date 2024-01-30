"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDeliveryUserInputs = exports.EditCustomerProfileInputs = exports.UserLoginInput = exports.CreateCustomerInputs = void 0;
var class_validator_1 = require("class-validator");
var CreateCustomerInputs = /** @class */ (function () {
    function CreateCustomerInputs() {
    }
    __decorate([
        (0, class_validator_1.IsEmail)(),
        __metadata("design:type", String)
    ], CreateCustomerInputs.prototype, "email", void 0);
    __decorate([
        (0, class_validator_1.Length)(7, 12),
        __metadata("design:type", String)
    ], CreateCustomerInputs.prototype, "phone", void 0);
    __decorate([
        (0, class_validator_1.Length)(6, 12),
        __metadata("design:type", String)
    ], CreateCustomerInputs.prototype, "password", void 0);
    return CreateCustomerInputs;
}());
exports.CreateCustomerInputs = CreateCustomerInputs;
var UserLoginInput = /** @class */ (function () {
    function UserLoginInput() {
    }
    __decorate([
        (0, class_validator_1.IsEmail)(),
        __metadata("design:type", String)
    ], UserLoginInput.prototype, "email", void 0);
    __decorate([
        (0, class_validator_1.Length)(6, 12),
        __metadata("design:type", String)
    ], UserLoginInput.prototype, "password", void 0);
    return UserLoginInput;
}());
exports.UserLoginInput = UserLoginInput;
var EditCustomerProfileInputs = /** @class */ (function () {
    function EditCustomerProfileInputs() {
    }
    __decorate([
        (0, class_validator_1.Length)(3, 16),
        __metadata("design:type", String)
    ], EditCustomerProfileInputs.prototype, "firstName", void 0);
    __decorate([
        (0, class_validator_1.Length)(3, 16),
        __metadata("design:type", String)
    ], EditCustomerProfileInputs.prototype, "lastName", void 0);
    __decorate([
        (0, class_validator_1.Length)(6, 16),
        __metadata("design:type", String)
    ], EditCustomerProfileInputs.prototype, "address", void 0);
    return EditCustomerProfileInputs;
}());
exports.EditCustomerProfileInputs = EditCustomerProfileInputs;
var CreateDeliveryUserInputs = /** @class */ (function () {
    function CreateDeliveryUserInputs() {
    }
    __decorate([
        (0, class_validator_1.IsEmail)(),
        __metadata("design:type", String)
    ], CreateDeliveryUserInputs.prototype, "email", void 0);
    __decorate([
        (0, class_validator_1.Length)(7, 12),
        __metadata("design:type", String)
    ], CreateDeliveryUserInputs.prototype, "phone", void 0);
    __decorate([
        (0, class_validator_1.Length)(6, 12),
        __metadata("design:type", String)
    ], CreateDeliveryUserInputs.prototype, "password", void 0);
    __decorate([
        (0, class_validator_1.Length)(3, 12),
        __metadata("design:type", String)
    ], CreateDeliveryUserInputs.prototype, "firstName", void 0);
    __decorate([
        (0, class_validator_1.Length)(3, 12),
        __metadata("design:type", String)
    ], CreateDeliveryUserInputs.prototype, "lastName", void 0);
    __decorate([
        (0, class_validator_1.Length)(6, 12),
        __metadata("design:type", String)
    ], CreateDeliveryUserInputs.prototype, "address", void 0);
    __decorate([
        (0, class_validator_1.Length)(4, 12),
        __metadata("design:type", String)
    ], CreateDeliveryUserInputs.prototype, "pincode", void 0);
    return CreateDeliveryUserInputs;
}());
exports.CreateDeliveryUserInputs = CreateDeliveryUserInputs;
//# sourceMappingURL=Customer.dto.js.map