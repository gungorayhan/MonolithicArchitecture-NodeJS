"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delivery = void 0;
var mongoose_1 = __importStar(require("mongoose"));
var DeliverySchema = new mongoose_1.Schema({
    email: { type: String, require: true },
    password: { type: String, require: true },
    salt: { type: String, require: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    phone: { type: String, require: true },
    pincode: { type: String },
    verified: { type: Boolean, require: true },
    lat: { type: Number },
    lng: { type: Number },
    isAvailable: { type: Boolean },
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v,
                delete ret.salt,
                delete ret.password,
                delete ret.createdAt,
                delete ret.updatedAt;
        }
    },
    timestamps: true
});
var Delivery = mongoose_1.default.model("delivery", DeliverySchema);
exports.Delivery = Delivery;
//# sourceMappingURL=DeliveryUser.js.map