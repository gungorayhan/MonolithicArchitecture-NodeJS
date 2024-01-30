import express,{Request, Response, NextFunction} from "express"
import {CreateVendor, GetDeliveryUsers, GetTransaction, GetTransactionById, GetVendorByID, GetVendors, VerifyDeliveryUser,} from "../controllers"

const route = express.Router();


route.post("/vendor", CreateVendor);
route.get("/vendors", GetVendors);
route.get("/vendor/:id", GetVendorByID);

route.get("/transaction",GetTransaction)
route.get("/transaction/:id",GetTransactionById)


route.get("/delivery/verify",VerifyDeliveryUser)
route.put("/delivery/users",GetDeliveryUsers)

export {route as AdminRoute}