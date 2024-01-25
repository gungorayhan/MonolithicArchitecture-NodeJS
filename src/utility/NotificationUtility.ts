//Email


//notification


//otp
export const GenerateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000)
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000))

    return { otp, expiry }
}



export const onRequestOTP = async (otp:number, toPhoneNumber:string)=>{
    const accountSid="";
    const authToken ="";
    const client = require("twilio")(accountSid,authToken);

    const response = await client.message.create({
        body:`Your Otp is ${otp}`,
        from:"+17752547626",
        to:`+90${toPhoneNumber}`
    })

    return response;
}


//payment notification or emails