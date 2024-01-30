import mongoose ,{Schema,Document} from "mongoose"


export interface DeliveryUserDoc extends Document{
    email:string;
    password:string;
    salt:string;
    firstName:string;
    lastName:string;
    address:string;
    phone:string;
    pincode:string;
    verified:boolean;
    lat:number;
    lng:number;
    isAvailable:boolean;
}


const DeliverySchema = new Schema({
    email:{type:String,require:true},
    password:{type:String,require:true},
    salt:{type:String,require:true},
    firstName:{type:String},
    lastName:{type:String},
    address:{type:String},
    phone:{type:String,require:true},
    pincode:{type:String},
    verified:{type:Boolean,require:true},
    lat:{type:Number},
    lng:{type:Number},
    isAvailable:{type:Boolean},
},
{
    toJSON:{
        transform(doc,ret){
            delete ret.__v,
            delete ret.salt,
            delete ret.password,
            delete ret.createdAt,
            delete ret.updatedAt
        }
    },
    timestamps:true
})

const Delivery = mongoose.model<DeliveryUserDoc>("delivery",DeliverySchema)

export {Delivery}