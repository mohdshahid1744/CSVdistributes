import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/dbConfig/dbConfig';
import Agent from "@/models/agentModel";

connect();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Extract ID from URL params

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
