import express,{Request, Response, NextFunction} from "express"
import {CreateVendor, GetVendorByID, GetVendors,} from "../controllers"
const route = express.Router();


route.post("/vendor", CreateVendor);

route.get("/vendors", GetVendors);

route.get("/vendor/:id", GetVendorByID);

export {route as AdminRoute}