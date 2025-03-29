import nodemailer from 'nodemailer';
import User from "@/models/userModel";
import bcryptjs from 'bcryptjs';
import crypto from 'crypto'; 

export const sendEmail = async({ email, emailType, userId }: any) => {
    try {
        const hashedToken = crypto.randomBytes(32).toString('hex');  

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken, 
                verifyTokenExpiry: Date.now() + 3600000
            });
        } else if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                forgotPassword: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 2525,
            auth: {
                user: "Empirefurniture001@gmail.com",
                pass: "isbi trzw iyit wzvg"
            }
        });

        const mailOption = {
            from: "Empirefurniture001@gmail.com",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.domain}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"}
            or copy and paste the  link below in your browser. <br>${process.env.domain}/verifyemail?token=${hashedToken}</p>`
        };

        const mailResponse = await transporter.sendMail(mailOption);
        return mailResponse;
    } catch (error: any) {
        console.error("Error in sendEmail:", error);
        throw new Error(error.message);
    }
};
