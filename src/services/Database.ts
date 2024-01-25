import mongoose,{ConnectOptions} from "mongoose";
import {MONGO_URI } from "../config"

export default async()=>{
    try {
        await mongoose.connect(MONGO_URI,{
            useNewUrlParser: true,
        }as ConnectOptions) 
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}