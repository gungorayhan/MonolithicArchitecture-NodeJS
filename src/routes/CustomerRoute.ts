import express from "express"
import { CustomerLogin, CustomerSignup, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOtp } from "../controllers";


const route=express.Router();

//---signup
route.post("/signup",CustomerSignup)

//---login
route.post("/login",CustomerLogin)


//------------authendication---------------

//---Verify
route.patch("/verify",CustomerVerify)


//---otp / requesting otp
route.get("/otp",RequestOtp)


//---profile

route.get("/profile",GetCustomerProfile)

route.patch("/profile",EditCustomerProfile)

export {route as CustomerRoute}