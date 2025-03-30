import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Item from "@/models/itemModel";
import Agent from "@/models/agentModel";
import csvParser from "csv-parser";
import { Readable } from "stream";

connect();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const agents = await Agent.find();
    if (agents.length === 0) {
      return NextResponse.json({ error: "No agents available" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer.toString().split("\n"));

    const items: any[] = [];

    await new Promise((resolve, reject) => {
      stream
        .pipe(csvParser({ mapHeaders: ({ header }) => header.trim() }))

        .on("data", (row) => {
          const name = row["Name"]?.trim();
          const mobile = row["Phone"]?.trim();
          const details = row["Notes"]?.trim();

          if (!name || !mobile || !details) {
            console.warn("Skipping row due to missing fields:", row);
            return;
          }

          items.push({ name, mobile, details });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (items.length === 0) {
      return NextResponse.json({ error: "No valid data found in CSV" }, { status: 400 });
    }

    const insertedItems = await Item.insertMany(items);
    const itemIds = insertedItems.map((item) => item._id);

    for (let i = 0; i < itemIds.length; i++) {
      const agentIndex = i % agents.length; // Rotate through agents
      const agentId = agents[agentIndex]._id;

      await Agent.findByIdAndUpdate(
        agentId,
        { $push: { assignedItems: itemIds[i] } }, 
        { new: true, upsert: true }
      );
    }

    return NextResponse.json(
      { message: "CSV uploaded and distributed successfully", items: insertedItems },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error uploading CSV:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
