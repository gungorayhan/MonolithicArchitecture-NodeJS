import express, {Request, Response, NextFunction} from "express"
import { AddFood, EditOffer, GetFoods, GetOffers, GetOrderDetails, GetVendorProfile, ProcessOrder, UpdateVendorCoverImage, UpdateVendorProfile, UpdateVendorService, VendorLogin } from "../controllers";
import { Authenticate } from "../middlewares";
import multer from "multer"


const route = express.Router();


const imageStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./images");
    },
    filename:function(req,file,cb){
        cb(null,new Date().toISOString().replace(/:/g, '-') + "_" +file.originalname) // !!!.replace(/:/g,'-') or not write .toISOString() function
    }
})

const images= multer({storage:imageStorage}).array("images",10);


route.post("/login",VendorLogin)

route.use(Authenticate);
route.get("/profile",GetVendorProfile)
route.patch("/profile",UpdateVendorProfile)
route.patch("/service",UpdateVendorService)
route.patch("/coverImage", images,UpdateVendorCoverImage)

route.post("/food", images,AddFood);
route.get("/foods",GetFoods);

//orders
route.get("/orders",GetOrderDetails)
route.put("/order/:id/process",ProcessOrder)
route.get("/order/:id",GetOrderDetails)


//offers
route.get("/offers",GetOffers)
route.post("/offer",AddFood)
route.put("/offer/:id",EditOffer)

export {route as VendorRoute}