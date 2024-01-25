"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var route = express_1.default.Router();
exports.ShoppingRoute = route;
//---Food availability
route.get("/:pincode", controllers_1.GetFoodAvailability);
//---Top Restaurans
route.get("/top-restaurants/:pincode", controllers_1.GetTopRestauranst);
//---Foods Available
route.get("/foots-in-30-min/:pincode", controllers_1.GetFoodsIn30Min);
//--search foods
route.get("/search/:pincode", controllers_1.SearchFoods);
//---find restaurand by id
route.get("/restaurant/:id", controllers_1.RestaurantById);
//# sourceMappingURL=ShoppingRoute.js.map