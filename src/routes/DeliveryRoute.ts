import express from "express"
import {Authenticate} from "../middlewares"
import { CustomerVerify, DeliveryUserLogin, DeliveryUserSignUp, EditDeliveryUserProfile, GetDeliveryUserProfile, UpdateDeliveryUserStatus } from "../controllers";

const route= express.Router();


//--------------signup / create 

route.post("/signup",DeliveryUserSignUp);


//------------Login----------
route.post("/login", DeliveryUserLogin);

//-----authenticate
route.use(Authenticate)

//----------Cahange Service status
route.put("/change-status",UpdateDeliveryUserStatus)

//----------profile
route.get("/profile",GetDeliveryUserProfile);

route.patch("/profile",EditDeliveryUserProfile);

export {route as DeliveryRoute}