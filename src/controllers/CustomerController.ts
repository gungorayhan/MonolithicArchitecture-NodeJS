import { Request, Response } from "express"
import { validate } from "class-validator"
import { plainToClass } from "class-transformer"
import { CreateCustomerInputs, EditCustomerProfileInputs, UserLoginInput } from "../dto"
import { GenerateOtp, GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword, onRequestOTP } from "../utility"
import { Customer } from "../models"

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
        lng: 0
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
        message:"Error with Request OTP"
    })
}


export const GetCustomerProfile = async (req: Request, res: Response) => { 

    const customer = req.user;

    if(customer){
        const profile = await Customer.findById(customer._id)

        if(profile){
            res.status(200).json(profile);
        }
    }

    return res.status(400).json({
        message:"Error with Fetch Profile"
    })
}


export const EditCustomerProfile = async (req: Request, res: Response) => { 

    const customer = req.user

    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body);

    const profileErrors = await validate(profileInputs,{validationError :{target :false}})

    if(profileErrors.length >0){
        return res.status(400).json(profileErrors);
    }

    const {firstName, lastName, address} = profileInputs;

    if(customer){
        const profile = await Customer.findById(customer._id);

        if(profile){
            profile.firtsName=firstName;
            profile.lastName=lastName;
            profile.address=address;

            const result = await profile.save();

            return res.status(201).json(result)
        }

    }

    return res.status(400).json({
        message:"Not Edit Profile"
    })

}
