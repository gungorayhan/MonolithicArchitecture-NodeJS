"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRoute = void 0;
var express_1 = __importDefault(require("express"));
var middlewares_1 = require("../middlewares");
var controllers_1 = require("../controllers");
var route = express_1.default.Router();
exports.DeliveryRoute = route;
//--------------signup / create 
route.post("/signup", controllers_1.DeliveryUserSignUp);
//------------Login----------
route.post("/login", controllers_1.DeliveryUserLogin);
//-----authenticate
route.use(middlewares_1.Authenticate);
//----------Cahange Service status
route.put("/change-status", controllers_1.UpdateDeliveryUserStatus);
//----------profile
route.get("/profile", controllers_1.GetDeliveryUserProfile);
route.patch("/profile", controllers_1.EditDeliveryUserProfile);
//# sourceMappingURL=DeliveryRoute.js.map