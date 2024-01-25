"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var route = express_1.default.Router();
exports.AdminRoute = route;
route.post("/vendor", controllers_1.CreateVendor);
route.get("/vendors", controllers_1.GetVendors);
route.get("/vendor/:id", controllers_1.GetVendorByID);
//# sourceMappingURL=AdminRoute.js.map