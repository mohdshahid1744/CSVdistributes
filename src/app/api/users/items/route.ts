import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Item from "@/models/itemModel";
import mongoose from "mongoose";

connect();

export async function GET() {
    try {
        console.log("Registered Models:", mongoose.modelNames()); 

        const items = await Item.find().populate("assignedTo").lean();

        console.log("Fetched Items:", items);

        return NextResponse.json({ items }, { status: 200 });
    } catch (error) {
        console.error("GET /items error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
