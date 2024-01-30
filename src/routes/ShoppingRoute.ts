import express from "express"
import { GetFoodAvailability, GetFoodsIn30Min, GetAvailableOffers, GetTopRestauranst, RestaurantById, SearchFoods } from "../controllers"

const route = express.Router()

//---Food availability
route.get("/:pincode", GetFoodAvailability)

//---Top Restaurans
route.get("/top-restaurants/:pincode",GetTopRestauranst)


//---Foods Available
route.get("/foots-in-30-min/:pincode", GetFoodsIn30Min)

//--search foods
route.get("/search/:pincode",SearchFoods)

//---find offers
route.get("/offers/:pincode",GetAvailableOffers)

//---find restaurand by id
route.get("/restaurant/:id", RestaurantById)


export {route as ShoppingRoute}