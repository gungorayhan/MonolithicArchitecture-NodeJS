import express from "express"
import { AddCart, CreateOrder, CustomerLogin, CreatePayment, CustomerSignup, CustomerVerify, DeleteCart, EditCustomerProfile, GetCart, GetCustomerProfile, GetOrderById, GetOrders, RequestOtp, VerifyOffer } from "../controllers";
import { Authenticate } from "../middlewares";


const route=express.Router();

//---signup
route.post("/signup",CustomerSignup)

//---login
route.post("/login",CustomerLogin)


//------------authendication--------------
route.use(Authenticate)

//---Verify
route.patch("/verify",CustomerVerify)


//---otp / requesting otp
route.get("/otp",RequestOtp)


//---profile

route.get("/profile",GetCustomerProfile)

route.patch("/profile",EditCustomerProfile)


//cart
route.post("/cart",AddCart);
route.get("cart",GetCart);
route.delete("/cart",DeleteCart);

//apply offers
route.get("/offer/verify/:id", VerifyOffer)

//payment
route.post("/create-payment",CreatePayment)

//order
route.post("/create-order", CreateOrder)
route.get("/orders", GetOrders)
route.get("order/:id",GetOrderById)



export {route as CustomerRoute}