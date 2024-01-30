"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var route = express_1.default.Router();
exports.CustomerRoute = route;
//---signup
route.post("/signup", controllers_1.CustomerSignup);
//---login
route.post("/login", controllers_1.CustomerLogin);
//------------authendication--------------
route.use(middlewares_1.Authenticate);
//---Verify
route.patch("/verify", controllers_1.CustomerVerify);
//---otp / requesting otp
route.get("/otp", controllers_1.RequestOtp);
//---profile
route.get("/profile", controllers_1.GetCustomerProfile);
route.patch("/profile", controllers_1.EditCustomerProfile);
//cart
route.post("/cart", controllers_1.AddCart);
route.get("cart", controllers_1.GetCart);
route.delete("/cart", controllers_1.DeleteCart);
//apply offers
route.get("/offer/verify/:id", controllers_1.VerifyOffer);
//payment
route.post("/create-payment", controllers_1.CreatePayment);
//order
route.post("/create-order", controllers_1.CreateOrder);
route.get("/orders", controllers_1.GetOrders);
route.get("order/:id", controllers_1.GetOrderById);
//# sourceMappingURL=CustomerRoute.js.map