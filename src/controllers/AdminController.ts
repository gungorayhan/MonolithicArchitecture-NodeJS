import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";


//-------------------------------------------------- service ------------------------------------------------------
export const FindVendor=async(id:string | undefined, email?:string)=>{
    if(email){

        return await Vendor.findOne({email:email}); 
        
    }else{

        return await Vendor.findById(id);
    }

}
//-----------------------------------------------------------------------------------------------------------------


export const CreateVendor =async(req:Request, res:Response, next:NextFunction)=>{
    console.log("vandor")
    const {name,ownerName,foodType,pincode, address,phone,email,password} = <CreateVendorInput>req.body;

    const existingVendor = await FindVendor("",email);

    if(existingVendor){

        return res.json({

            "message":"A vendor is exist with this email ID",

        })
    }

    //generate salt
    const salt =await GenerateSalt();

    //generate password
    const userPassword= await GeneratePassword(password,salt);


    const createVendor = await Vendor.create({
        name:name,
        adress:address,
        pincode:pincode,
        foodType:foodType,
        email:email,
        password:userPassword,
        salt:salt,
        ownerName:ownerName,
        phone:phone,
        rating:0,
        serviceAvailable:false,
        coverImage:[],
        foods:[]
    })


    return res.json(createVendor)
}

export const GetVendors =async(req:Request, res:Response, next:NextFunction)=>{

    const vendors = await Vendor.find();

    if(vendors !== null){
        return res.json(vendors);
    }

    return res.json({
        "message":"vandors data not available"
    })

}

export const GetVendorByID =async(req:Request, res:Response, next:NextFunction)=>{

    const vendorId= req.params.id;

    const vendor = await FindVendor(vendorId);

    if(vendor !== null) {

        return res.json(vendor);
    
    }

    return res.json({"message":"Vendor is not available"})
    
}