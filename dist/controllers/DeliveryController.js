"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDeliveryUserStatus = exports.EditDeliveryUserProfile = exports.GetDeliveryUserProfile = exports.DeliveryUserLogin = exports.DeliveryUserSignUp = void 0;
var class_transformer_1 = require("class-transformer");
var dto_1 = require("../dto");
var class_validator_1 = require("class-validator");
var utility_1 = require("../utility");
var models_1 = require("../models");
var DeliveryUserSignUp = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deliveryUserInputs, inputErrors, email, phone, password, address, firstName, lastName, pincode, salt, userPassword, existingDeliveryUser, result, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deliveryUserInputs = (0, class_transformer_1.plainToClass)(dto_1.CreateDeliveryUserInputs, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(deliveryUserInputs, { validationError: { target: true } })];
            case 1:
                inputErrors = _a.sent();
                if (inputErrors.length > 0) {
                    return [2 /*return*/, res.status(400).json(inputErrors)];
                }
                email = deliveryUserInputs.email, phone = deliveryUserInputs.phone, password = deliveryUserInputs.password, address = deliveryUserInputs.address, firstName = deliveryUserInputs.firstName, lastName = deliveryUserInputs.lastName, pincode = deliveryUserInputs.pincode;
                return [4 /*yield*/, (0, utility_1.GenerateSalt)()];
            case 2:
                salt = _a.sent();
                return [4 /*yield*/, (0, utility_1.GeneratePassword)(password, salt)];
            case 3:
                userPassword = _a.sent();
                return [4 /*yield*/, models_1.Delivery.findOne({ email: email })];
            case 4:
                existingDeliveryUser = _a.sent();
                if (existingDeliveryUser !== null) {
                    return [2 /*return*/, res.status(409).json({ message: "A delivery user exist with the provide email acount" })];
                }
                return [4 /*yield*/, models_1.Delivery.create({
                        email: email,
                        password: userPassword,
                        salt: salt,
                        phone: phone,
                        firstName: firstName,
                        lastName: lastName,
                        address: address,
                        verified: false,
                        pincode: pincode,
                        lat: 0,
                        lng: 0,
                        isAvailable: false
                    })];
            case 5:
                result = _a.sent();
                if (result) {
                    signature = (0, utility_1.GenerateSignature)({
                        _id: result._id,
                        email: result.email,
                        verified: result.verified
                    });
                    return [2 /*return*/, res.status(200).json({ signature: signature, verified: result.verified, email: result.email })];
                }
                return [2 /*return*/, res.status(400).json({ message: "Error with signup" })];
        }
    });
}); };
exports.DeliveryUserSignUp = DeliveryUserSignUp;
var DeliveryUserLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var loginInputs, loginErrors, email, password, customer, validation, signature;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                loginInputs = (0, class_transformer_1.plainToClass)(dto_1.UserLoginInput, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(loginInputs, { validationError: { target: false } })];
            case 1:
                loginErrors = _a.sent();
                if (loginErrors.length > 0) {
                    return [2 /*return*/, res.status(400).json(loginErrors)];
                }
                email = loginInputs.email, password = loginInputs.password;
                return [4 /*yield*/, models_1.Delivery.findOne({ email: email })];
            case 2:
                customer = _a.sent();
                if (!customer) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, utility_1.ValidatePassword)(password, customer.password, customer.salt)];
            case 3:
                validation = _a.sent();
                if (validation) {
                    signature = (0, utility_1.GenerateSignature)({
                        _id: customer.id,
                        email: customer.email,
                        verified: customer.verified
                    });
                    return [2 /*return*/, res.status(201).json({
                            signature: signature,
                            verified: customer.verified,
                            email: customer.email
                        })];
                }
                _a.label = 4;
            case 4: return [2 /*return*/, res.status(404).json({ message: 'Login error' })];
        }
    });
}); };
exports.DeliveryUserLogin = DeliveryUserLogin;
var GetDeliveryUserProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deliveryUser, profile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deliveryUser = req.user;
                if (!deliveryUser) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Delivery.findById(deliveryUser._id)];
            case 1:
                profile = _a.sent();
                if (profile) {
                    return [2 /*return*/, res.status(200).json(profile)];
                }
                _a.label = 2;
            case 2: return [2 /*return*/, res.status(4000).json({
                    message: "error with fetch profile"
                })];
        }
    });
}); };
exports.GetDeliveryUserProfile = GetDeliveryUserProfile;
var EditDeliveryUserProfile = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deliveryUser, profileInputs, profileErrors, firstName, lastName, address, profile, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deliveryUser = req.user;
                profileInputs = (0, class_transformer_1.plainToClass)(dto_1.EditCustomerProfileInputs, req.body);
                return [4 /*yield*/, (0, class_validator_1.validate)(profileInputs, { validationError: { target: false } })];
            case 1:
                profileErrors = _a.sent();
                if (profileErrors.length > 0) {
                    return [2 /*return*/, res.status(400).json(profileErrors)];
                }
                firstName = profileInputs.firstName, lastName = profileInputs.lastName, address = profileInputs.address;
                if (!deliveryUser) return [3 /*break*/, 4];
                return [4 /*yield*/, models_1.Delivery.findById(deliveryUser._id)];
            case 2:
                profile = _a.sent();
                if (!profile) return [3 /*break*/, 4];
                profile.firstName = firstName;
                profile.lastName = lastName;
                profile.address = address;
                return [4 /*yield*/, profile.save()];
            case 3:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json(result)];
            case 4: return [2 /*return*/, res.status(400).json({ message: "Error with fetch profile" })];
        }
    });
}); };
exports.EditDeliveryUserProfile = EditDeliveryUserProfile;
var UpdateDeliveryUserStatus = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deliveryUser, _a, lat, lng, profile, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                deliveryUser = req.user;
                if (!deliveryUser) return [3 /*break*/, 3];
                _a = req.body, lat = _a.lat, lng = _a.lng;
                return [4 /*yield*/, models_1.Delivery.findById(deliveryUser._id)];
            case 1:
                profile = _b.sent();
                if (!profile) return [3 /*break*/, 3];
                if (lat && lng) {
                    profile.lat;
                    profile.lng;
                }
                profile.isAvailable = !profile.isAvailable;
                return [4 /*yield*/, profile.save()];
            case 2:
                result = _b.sent();
                return [2 /*return*/, res.status(200).json(result)];
            case 3: return [2 /*return*/, res.status(400).json({ message: "Error with update status" })];
        }
    });
}); };
exports.UpdateDeliveryUserStatus = UpdateDeliveryUserStatus;
//# sourceMappingURL=DeliveryController.js.map