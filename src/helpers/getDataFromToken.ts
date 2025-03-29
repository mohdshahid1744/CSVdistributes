import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || '';
        if (!process.env.USER_SECRET_KEY) {
            throw new Error("USER_SECRET_KEY is not defined in environment variables");
        }
        const decodedToken:any = jwt.verify(token, process.env.USER_SECRET_KEY);
        return decodedToken.id;
    } catch (error: any) {
        console.error("Token verification failed:", error.message);
        return null;
    }
};
