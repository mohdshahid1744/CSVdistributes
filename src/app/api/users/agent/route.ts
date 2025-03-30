import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/dbConfig/dbConfig';
import Agent from "@/models/agentModel";
import Item from "@/models/itemModel";
import mongoose from "mongoose";

connect();

export async function POST(req: NextRequest) {
    try {
      const { name, email, mobile, password } = await req.json();
  
      const existingAgent = await Agent.findOne({ email });
      if (existingAgent) {
        return NextResponse.json({ error: "Agent already exists" }, { status: 400 });
      }
  
      const newAgent = new Agent({
        name,
        email,
        mobile,
        password,
        assignedItems: [], 
      });
  
      await newAgent.save(); 
  
      return NextResponse.json(
        { message: "Agent created successfully", agent: newAgent },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error creating agent:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  
  

  export async function GET() {
    try {
      console.log("Registered Models:", mongoose.modelNames());
  
      const populatedAgents = await Agent.find().populate("assignedItems").lean(); 
  
      console.log("Populated agents:", populatedAgents);
  
      return NextResponse.json({ agents: populatedAgents }, { status: 200 });
    } catch (error) {
      console.error("GET /agent error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
  

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { id } = params;
  
      if (!id) {
        return NextResponse.json({ error: "Agent ID is required" }, { status: 400 });
      }
  
      const deletedAgent = await Agent.findByIdAndDelete(id);
      if (!deletedAgent) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
      }
  
      return NextResponse.json({ message: "Agent deleted successfully" }, { status: 200 });
    } catch (error) {
      console.error("DELETE /agent error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }