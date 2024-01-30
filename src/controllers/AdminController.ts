import { Request, Response, NextFunction } from "express";
import { CreateVendorInput } from "../dto";
import { Delivery, Transaction, Vendor } from "../models";
import { GeneratePassword, GenerateSalt } from "../utility";
import { DeliveryUserSignUp } from "./DeliveryController";


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
        foods:[],
        lat:0,
        lng:0
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


export const GetTransaction = async (req:Request,res:Response)=>{
    const transaction = await Transaction.find();

    if(transaction){
        return res.status(200).json(transaction)
    }

    return res.json({message:"Transaction not available!"});
}


export const GetTransactionById = async (req:Request,res:Response)=>{
    const id = req.params.id;
    const transaction = await Transaction.findById(id);
    if(transaction){
        return res.status(200).json(transaction);
    }
    return res.json({message:"Transaction not available!"})
}

export const VerifyDeliveryUser = async (req:Request,res:Response)=>{
    const {_id, status} = req.body;

    if(_id){
        const profile = await Delivery.findById(_id);
        if(profile){
            profile.verified = status;
            const result = await profile.save();
            return res.status(200).json(result); 
        }
    }
    return res.status(400).json({message:"unable to verfy delivery user"})
}

export const GetDeliveryUsers = async (req:Request,res:Response)=>{

    const deliveryUsers = await Delivery.find();

    if(deliveryUsers){
        return res.status(200).json(deliveryUsers)
    }
return res.status(400).json({
    message:"unable to get delivery users"
})
}