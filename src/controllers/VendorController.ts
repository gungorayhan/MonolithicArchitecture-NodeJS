import { Request, Response, NextFunction, request } from "express"
import { EditVendorInput, VendorLoginInputs } from "../dto"
import { FindVendor } from "./AdminController";
import { GenerateSignature, ValidatePassword } from "../utility";
import { CreateFood } from "../dto/Food.dto";
import { Food } from "../models";


export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = <VendorLoginInputs>req.body;

    const existingVendor = await FindVendor('', email)

    if (existingVendor !== null) {
        //validation and give access
        const validation = await ValidatePassword(password, existingVendor.password, existingVendor.salt);

        if (validation) {
            const signature = GenerateSignature({
                _id: existingVendor.id,
                email: existingVendor.email,
                foodTypes: existingVendor.foodType,
                name: existingVendor.name
            })
            return res.json(signature)
        } else {
            return res.json({
                "message": "Password or Email is not valid"
            })
        }
    }

    res.json({
        "message": "Login Credential not valid"
    })
}


export const GetVendorProfile = async (req: Request, res: Response) => {
    const user = req.user;
    if (user) {
        const existingVendor = await FindVendor(user._id);
        return res.json(existingVendor);
    }

    return res.json({ "message": "Vendor information not found" })
}

export const UpdateVendorProfile = async (req: Request, res: Response) => {

    const { name, address, phone, foodTypes } = <EditVendorInput>req.body
    const user = req.user;
    if (user) {
        const existingVendor = await FindVendor(user._id)
        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodTypes
        }
        return res.json(existingVendor);
    }
    return res.json({ "message": "Vendor information not found" });
}


export const UpdateVendorCoverImage=async(req:Request, res:Response)=>{
    const user= req.user;

    if(user){
        const vendor = await FindVendor(user._id);

        if(vendor !== null){
            const files = req.files as [Express.Multer.File]
            const images = files.map((file:Express.Multer.File)=>file.filename)
            vendor.coverImages.push(...images)
            const result = await vendor.save();
            return res.json(result);
        }
    }

    return res.json({"message":"Vendor information not found"})
}


export const UpdateVendorService = async (req: Request, res: Response) => {

    const user = req.user;
    if (user) {
        const existingVendor = await FindVendor(user._id)
        if (existingVendor !== null) {
            existingVendor.serviceAvailable = !existingVendor.serviceAvailable;
            const saveResult = await existingVendor.save();
            return res.json(saveResult)
        }
        return res.json(existingVendor)
    }
    return res.json({ "message": "Vendor information not found" })
}


export const AddFood = async (req: Request, res: Response) => {
    const user = req.user;

    if (user) {
        const { name, description, category, foodType, readyTime, price } = <CreateFood>req.body;

        const vendor = await FindVendor(user._id);

        if(vendor !== null){

            const files= req.files as [Express.Multer.File];
            const images=files.map((file: Express.Multer.File)=>file.filename);

            const createFood = await Food.create({
                vendorId:vendor._id,
                name:name,
                description:description,
                category:category,
                foodType:foodType,
                images:images,
                readyTime:readyTime,
                price:price,
                rating:0 
            })

            vendor.foods.push(createFood);
            const result = await vendor.save();
            return res.json(result);
        }
    }
    return res.json({"message":"Something went wrong with add food"})
}


export const GetFoods = async (req:Request, res:Response)=>{
    const user=req.user;

    if(user){
        const foods= await Food.find({vendorId:user._id});
        if(foods !== null){
            return res.json(foods)
        }
    }

    return res.json({"message":"Foods information not found"})
}