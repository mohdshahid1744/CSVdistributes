import { connect } from '@/dbConfig/dbConfig';
import User from "@/models/userModel";
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '@/helpers/mailer';

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;
        console.log("Received request body:", reqBody);

        const user = await User.findOne({ email });
        if (user) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        
        console.log("Saving new user to database...");
        const savedUser = await newUser.save();
        console.log("User saved:", savedUser);

        await sendEmail({ email, emailType: "VERIFY", userId: savedUser._id });
        console.log("Verification email sent successfully.");

        return NextResponse.json({ message: "User created successfully", success: true, user: savedUser });

    } catch (error: any) {
        console.error("Error in signup process:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
 