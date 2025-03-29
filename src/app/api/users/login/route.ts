import { connect } from '@/dbConfig/dbConfig'
import User from "@/models/userModel"
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { email, password } = reqBody
        console.log(reqBody);
        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({ error: "User doesn't exist" }, { status: 400 })
        }
        const validatePassword = await bcryptjs.compare(password, user.password)
        if (!validatePassword) {
            return NextResponse.json({ error: "Wrong password" }, { status: 400 })
        }

        const secretKey = process.env.USER_SECRET_KEY
        if (!secretKey) {
            throw new Error('USER_SECRET_KEY is not defined in environment variables')
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }
        const token = await jwt.sign(tokenData, secretKey, { expiresIn: "1h" })

        const response = NextResponse.json({ message:"Login Successfully",success:true }, { status: 200 })
        response.cookies.set("token",token,{httpOnly:true,})
        return response
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}


