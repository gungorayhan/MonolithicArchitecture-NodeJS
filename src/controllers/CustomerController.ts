import { Request, Response } from "express"
import { validate } from "class-validator"
import { plainToClass } from "class-transformer"
import { CartItem, CreateCustomerInputs, EditCustomerProfileInputs, OrderInputs, UserLoginInput } from "../dto"
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword, onRequestOTP } from "../utility"
import { Customer, Delivery, Food, Offer, Transaction, Vendor } from "../models"
import { Order } from "../models"

export const CustomerSignup = async (req: Request, res: Response) => {
    const customerInputs = plainToClass(CreateCustomerInputs, req.body);
    const inputErrors = await validate(customerInputs, { validationError: { target: true } })
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, phone, password } = customerInputs;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const { otp, expiry } = GenerateOtp()

    const existCustomer = await Customer.findOne({ email })
    if (existCustomer !== null) {
        return res.status(409).json({ message: "Error with Signup" })
    }



    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firtsName: "",
        lastName: "",
        address: "",
        verified: false,
        lat: 0,
        lng: 0,
        orders: []
    })

    if (result) {

        //send the otp to customer
        await onRequestOTP(otp, phone); // twilio

        // generate the signature
        const signature = GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified,
        })


        //send the result client
        return res.status(201).json({ signature: signature, verified: result.verified, email: result.email })
    }
    return res.status(201).json({
        message: "Error with Signup"
    })
}


export const CustomerLogin = async (req: Request, res: Response) => {

    const loginInput = plainToClass(UserLoginInput, req.body);
    const loginErrors = await validate(loginInput, { validationError: { target: true } })

    if (loginErrors.length > 0) {
        return res.status(400).json({
            message: loginErrors
        })
    }


    const { email, password } = loginInput;

    const customer = await Customer.findOne({ email: email })

    if (customer) {
        const validation = await ValidatePassword(password, customer.password, customer.salt)

        if (validation) {
            //generate the siganture
            const signature = GenerateSignature({
                _id: customer._id,
                email: customer.email,
                verified: customer.verified
            })

            return res.status(201).json({
                signature: signature,
                verified: customer.verified,
                email: customer.email
            })
        }
    }

    return res.status(400).json({
        message: "Login Error"
    })

}


export const CustomerVerify = async (req: Request, res: Response) => {

    const { otp } = req.body;
    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id);
        if (profile) {
            if (profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()) {
                profile.verified = true;
                const updatedCustomerResponse = await profile.save();

                //generate the signature
                const signature = GenerateSignature({
                    _id: updatedCustomerResponse._id,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified

                })

                return res.status(201).json({
                    signature: signature,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })

            }
        }
    }
    return res.status(400).json({
        message: "Error with OTP validation"
    })

}


export const RequestOtp = async (req: Request, res: Response) => {

    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id)

        if (profile) {
            const { otp, expiry } = GenerateOtp();
            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();
            await onRequestOTP(otp, profile.phone);

            res.status(200).json({
                message: "OTP sen your registired phone number"
            })
        }
    }
    return res.status(400).json({
        message: "Error with Request OTP"
    })
}


export const GetCustomerProfile = async (req: Request, res: Response) => {
    console.log("first")
    const customer = req.user;
    console.log(customer)
    if (customer) {
        const profile = await Customer.findById(customer._id)

        if (profile) {
            return res.status(200).json(profile);
        }
    }

    return res.status(400).json({
        message: "Error with Fetch Profile"
    })
}


export const EditCustomerProfile = async (req: Request, res: Response) => {

    const customer = req.user

    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

    const profileErrors = await validate(profileInputs, { validationError: { target: false } })

    if (profileErrors.length > 0) {
        return res.status(400).json(profileErrors);
    }

    const { firstName, lastName, address } = profileInputs;

    if (customer) {
        const profile = await Customer.findById(customer._id);

        if (profile) {
            profile.firtsName = firstName;
            profile.lastName = lastName;
            profile.address = address;

            const result = await profile.save();

            return res.status(201).json(result)
        }

    }

    return res.status(400).json({
        message: "Not Edit Profile"
    })

}


//----cart section---------

export const AddCart = async (req: Request, res: Response) => {

    const customer = req.user;

    if (customer) {

        const profile = await Customer.findById(customer._id).populate("cart.food");
        let cartItems = Array();

        const { _id, unit } = <CartItem>req.body;
        const food = await Food.findById(_id);

        if (food) {
            if (profile !== null) {
                cartItems = profile.cart
                if (cartItems.length > 0) {

                    let existFoodItem = cartItems.filter(item => item.food._id.toString() === _id)
                    if (existFoodItem) {
                        const index = cartItems.indexOf(existFoodItem[0])
                        if (unit > 0) {
                            cartItems[index] = { food, unit }

                        } else {
                            cartItems.splice(index, 1)
                        }

                    } else {
                        cartItems.push({ food, unit })
                    }

                } else {
                    cartItems.push({
                        food: food,
                        unit: unit
                    })
                }

                if (cartItems) {
                    profile.cart = cartItems as any;
                    const cartresult = await profile.save();

                    return res.status(200).json(cartresult.cart)
                }
            }
        }

    }


    return res.status(400).json({ message: "unable to create cart" })


}


export const GetCart = async (req: Request, res: Response) => {

    const customer = req.user;

    if (customer) {
        const profile = await Customer.findById(customer._id).populate("cart.food");
        if (profile) {
            return res.status(200).json(profile.cart)
        }
    }

    return res.status(200).json({ message: "cart is empty" })
}


export const DeleteCart = async (req: Request, res: Response) => {
    const customer = req.user

    if (customer) {
        const profile = await Customer.findById(customer._id)
        if (profile !== null) {
            profile.cart = [] as any
            const cartResult = await profile.save();
            return res.status(200).json(cartResult)
        }

    }

    return res.status(400).json({
        message: "cart is already empty!"
    })
}


//-------------------create payment

export const CreatePayment = async (req: Request, res: Response) => {

    const customer = req.user;
    const { amount, paymentMode, offerId } = req.body;

    if (!customer) {
        return res.json({
            message: "Not Login"
        })
    }
    let payableAmount = Number(amount);
    if (offerId) {
        const appliedOffer = await Offer.findById(offerId);
        if (appliedOffer) {
            if (appliedOffer.isActive) {
                payableAmount = (payableAmount - appliedOffer.offerAmount)
            }
        }
    }

    const transaction = await Transaction.create({
        customer: customer._id,
        vendorId: '',
        orderId: '',
        orderValue: payableAmount,
        offerUsed: offerId || 'NA',
        status: 'OPEN',
        paymentMode: paymentMode,
        paymentResponse: 'Payment is Cash on Delivery'
    })

    return res.status(200).json(transaction)
}

//---------delivery notification

const assignOrderForDelivery = async (orderId:string, vendorId:string)=>{

    //find the vendor
    const vendor = await Vendor.findById(vendorId)

    if(vendor){
        const areaCode = vendor.pincode;
        const vendorLat = vendor.lat;
        const vendorLng = vendor.lng;
           //find the available delivery person
           const deliveryPerson = await Delivery.find({pincode:areaCode, verified:true,isAvailable:true})

           if(deliveryPerson){
              //check the nearest delivery person and assign the order
              console.log('Delivery Person ' + deliveryPerson);

              const currentOrder = await Order.findById(orderId);

              if(currentOrder){
                //update deliveryID
                currentOrder.deliveryId= deliveryPerson[0]._id
                const response  = await currentOrder.save();
                console.log(response);
                //!! notify to vendor for received new order firebase push notification

              }
           }
    }

}



//------------------order section

const validateTransaction = async (txnId: string) => {
    const currentTransaction = await Transaction.findById(txnId);
    if (currentTransaction) {
        if (currentTransaction.status.toLocaleLowerCase() !== 'failed') {
            return { status: true, currentTransaction }
        }
    }
    return { status: false, currentTransaction }
}


export const CreateOrder = async (req: Request, res: Response) => {

    const customer = req.user
    const { txnId, amount, items } = <OrderInputs>req.body;
    if (customer) {

        //validate ttransaction

        const { status, currentTransaction } = await validateTransaction(txnId)

        if (!status) {
            return res.status(404).json({
                message: "Error with Create Order"
            })
        }


        const orderId = `${Math.floor(Math.random() * 89999) + 1000}`

        const profile = await Customer.findById(customer._id)
        if (profile == null) {
            return res.status(201).json({ message: "Profile Null" })
        }
        // const cart = <[OrderInputs]>req.body;

        let cartItems = Array();

        let netAmount = 0.0;
        let vendorId;

        const foods = await Food.find().where('_id').in(items.map(item => item._id)).exec();

        foods.map(food => {
            items.map(({ _id, unit }) => {
                if (food._id == _id) {
                    vendorId = food.vendorId;
                    netAmount += (food.price * unit);
                    cartItems.push({ food, unit });
                }
            })
        })

        if (cartItems) {
            const currentOrder = await Order.create({
                orderId: orderId,
                vendorId: vendorId,
                items: cartItems,
                totalAmount: netAmount,
                paidAmount:amount,
                orderDate: new Date(),
                // paidThrough: 'COD',
                // paymentResponse: 'some json response stringify',
                orderStatus: "Waiting",
                remarks: "",
                deliveryId: "",
                // appliedOffers: false,
                // offerId: null,
                readyTime: 45
            })

            if (currentOrder) {
                profile.cart = [] as any;
                profile.orders.push(currentOrder);
            }

            if (currentTransaction !== null) {
                if (vendorId != undefined) {
                    currentTransaction.vendorId = vendorId;
                    currentTransaction.orderId = orderId;
                    currentTransaction.status = 'CONFIRMED';
                    await currentTransaction.save();
                    assignOrderForDelivery(currentOrder._id,vendorId);
                }
            }

            

            const profileSaveResponse = await profile.save();

            return res.status(200).json(profileSaveResponse);

        }

    }
    return res.status(400).json({
        message: "Error with Create Order!"
    })
}
export const GetOrders = async (req: Request, res: Response) => {
    const customer = req.user
    if (customer) {
        const profile = await Customer.findById(customer._id).populate("orders")

        if (profile) {
            return res.status(200).json(profile.orders);
        }
    }

    return res.status(400).json({
        message: "Error not customer"
    })
}
export const GetOrderById = async (req: Request, res: Response) => {

    const orderId = req.params.id

    if (orderId) {
        const order = await Order.findById(orderId).populate("items.food")
        return res.status(200).json(order)
    }

    return res.status(400).json({
        message: "Error not customer"
    })
}


export const VerifyOffer = async (req: Request, res: Response) => {
    const offerId = req.params.id;
    const customer = req.user;


    if (customer) {
        const appliedOffer = await Offer.findById(offerId);

        if (appliedOffer) {
            if (appliedOffer.promoType === "USER") {

            } else {
                if (appliedOffer.isActive) {
                    return res.status(200).json({
                        message: "offer is valid",
                        offer: appliedOffer
                    })
                }
            }
        }
    }

    return res.status(400).json({ message: "offer is not valid" })
}

