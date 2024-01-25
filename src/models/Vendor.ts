import mongoose, { Document, Schema, Model } from "mongoose"

interface VendorDoc extends Document {
    name: string,
    ownerName: string,
    foodType: [string],
    pincode: string,
    address: string,
    phone: string,
    email: string,
    password: string,
    salt: string,
    serviceAvailable: boolean,
    coverImages: [string],
    rating: number,
    foods:any
}

const VendorSchema = new Schema({
    name:{type:String, require:true},
    owner:{type:String, require:true},
    foodType:{type:[String]},
    pincode:{type:String, require:true},
    address:{type:String, require:true},
    phone:{type:String, require:true},
    email:{type:String, require:true},
    password:{type:String, require:true},
    salt:{type:String, require:true},
    serviceAvailable:{type:Boolean},
    coverImages:{type:[String]},
    rating:{type:Number},
    foods:[{
        type:mongoose.Schema.ObjectId,
        ref:"food"
    }]
},
{
    toJSON:{
       transform(doc,ret){
        delete ret.password,
        delete ret.salt,
        delete ret.__v,
        delete ret.createdAt,
        delete ret.updatedAt
       }
    },
    timestamps:true
})


const Vendor = mongoose.model<VendorDoc>("vendor", VendorSchema);

export {Vendor}