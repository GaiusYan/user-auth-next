import {Resend} from "resend";

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
) =>{

    console.log(email);
    
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Two Factor Authentication",
        html: `<p>Your two factor authentication code is: <strong>${token}</strong></p>`
    }); 
} 
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    const resetLink = process.env.CONFIRM_EMAIL_LINK + `auth/new-password?token=${token}`;
    const {data,error} = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
    });

    if (error){
        console.log(error);
    }

    console.log(data);
};



export const sendVerificationEmail = async (
    email: string,
    token: string) => {

    const confirmLink = process.env.CONFIRM_EMAIL_LINK +`auth/new-verification?token=${token}`;

    const {data,error } = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email.</p>`
    });

    if(error) {
        console.log(error);
    }

    console.log(data);
    

    console.log("Email sent!",email);
};