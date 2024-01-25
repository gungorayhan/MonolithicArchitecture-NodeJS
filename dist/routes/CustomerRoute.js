"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var route = express_1.default.Router();
exports.CustomerRoute = route;
//---signup
route.post("/signup", controllers_1.CustomerSignup);
//---login
route.post("/login", controllers_1.CustomerLogin);
//------------authendication---------------
//---Verify
route.patch("/verify", controllers_1.CustomerVerify);
//---otp / requesting otp
route.get("/otp", controllers_1.RequestOtp);
//---profile
route.get("/profile", controllers_1.GetCustomerProfile);
route.patch("/profile", controllers_1.EditCustomerProfile);
//# sourceMappingURL=CustomerRoute.js.map