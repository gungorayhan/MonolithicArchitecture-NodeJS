"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var middlewares_1 = require("../middlewares");
var multer_1 = __importDefault(require("multer"));
var route = express_1.default.Router();
exports.VendorRoute = route;
var imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./images");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + "_" + file.originalname); // !!!.replace(/:/g,'-') or not write .toISOString() function
    }
});
var images = (0, multer_1.default)({ storage: imageStorage }).array("images", 10);
route.post("/login", controllers_1.VendorLogin);
route.use(middlewares_1.Authenticate);
route.get("/profile", controllers_1.GetVendorProfile);
route.patch("/profile", controllers_1.UpdateVendorProfile);
route.patch("/service", controllers_1.UpdateVendorService);
route.patch("/coverImage", images, controllers_1.UpdateVendorCoverImage);
route.post("/food", images, controllers_1.AddFood);
route.get("/foods", controllers_1.GetFoods);
//orders
route.get("/orders", controllers_1.GetOrderDetails);
route.put("/order/:id/process", controllers_1.ProcessOrder);
route.get("/order/:id", controllers_1.GetOrderDetails);
//offers
route.get("/offers", controllers_1.GetOffers);
route.post("/offer", controllers_1.AddFood);
route.put("/offer/:id", controllers_1.EditOffer);
//# sourceMappingURL=VendorRoute.js.map