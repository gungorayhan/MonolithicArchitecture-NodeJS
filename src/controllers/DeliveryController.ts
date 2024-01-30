import { plainToClass } from "class-transformer"
import express, { Request, Response } from "express"
import { CreateDeliveryUserInputs, EditCustomerProfileInputs, UserLoginInput } from "../dto"
import { Validate, validate } from "class-validator";
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from "../utility";
import { Delivery } from "../models";
import { EditCustomerProfile } from "./CustomerController";


export const DeliveryUserSignUp = async (req: Request, res: Response) => {
    const deliveryUserInputs = plainToClass(CreateDeliveryUserInputs, req.body);
    const inputErrors = await validate(deliveryUserInputs, { validationError: { target: true } })

    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, phone, password, address, firstName, lastName, pincode } = deliveryUserInputs;

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);

    const existingDeliveryUser = await Delivery.findOne({ email: email })

    if (existingDeliveryUser !== null) {
        return res.status(409).json({ message: "A delivery user exist with the provide email acount" })
    }

    const result = await Delivery.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        firstName: firstName,
        lastName: lastName,
        address: address,
        verified: false,
        pincode:pincode,
        lat: 0,
        lng: 0,
        isAvailable: false
    })

    if (result) {
        const signature = GenerateSignature({
            _id: result._id,
            email: result.email,
            verified: result.verified
        })

        return res.status(200).json({ signature: signature, verified: result.verified, email: result.email })
    }

    return res.status(400).json({ message: "Error with signup" })
}

export const DeliveryUserLogin = async (req: Request, res: Response) => {

    const loginInputs = plainToClass(UserLoginInput, req.body);

    const loginErrors = await validate(loginInputs, { validationError: { target: false } });

    if (loginErrors.length > 0) {
        return res.status(400).json(loginErrors)
    }

    const { email, password } = loginInputs

    const customer = await Delivery.findOne({ email: email })

    if (customer) {
        const validation = await ValidatePassword(password, customer.password, customer.salt);

        if (validation) {
            const signature = GenerateSignature({
                _id: customer.id,
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
    return res.status(404).json({ message: 'Login error' })
}


export const GetDeliveryUserProfile = async (req: Request, res: Response) => {

    const deliveryUser = req.user;

    if (deliveryUser) {
        const profile = await Delivery.findById(deliveryUser._id)
        if (profile) {
            return res.status(200).json(profile)
        }
    }

    return res.status(4000).json({
        message: "error with fetch profile"
    })
}



export const EditDeliveryUserProfile = async (req: Request, res: Response) => {
    const deliveryUser = req.user;

    const profileInputs = plainToClass(EditCustomerProfileInputs, req.body)

    const profileErrors = await validate(profileInputs, { validationError: { target: false } })
    if (profileErrors.length > 0) {
        return res.status(400).json(profileErrors)
    }

    const { firstName, lastName, address } = profileInputs

    if (deliveryUser) {
        const profile = await Delivery.findById(deliveryUser._id)

        if (profile) {
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;

            const result = await profile.save();
            return res.status(200).json(result);
        }
    }
    return res.status(400).json({ message: "Error with fetch profile" })
}


export const UpdateDeliveryUserStatus = async (req: Request, res: Response) => {

    const deliveryUser = req.user;

    if (deliveryUser) {
        const { lat, lng } = req.body;

        const profile = await Delivery.findById(deliveryUser._id);

        if (profile) {

            if (lat && lng) {
                profile.lat;
                profile.lng;
            }

            profile.isAvailable = !profile.isAvailable;
            const result = await profile.save();

            return res.status(200).json(result);
        }
    }
    return res.status(400).json({message:"Error with update status"})
}