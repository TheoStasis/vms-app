import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visit from "@/models/Visit.model";

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch visitors who are either waiting at the gate OR currently inside
    const visitors = await Visit.find({
      status: { $in: ["Approved", "Checked-In"] }
    }).populate("hostId", "name email").sort({ createdAt: -1 });

    return NextResponse.json(visitors);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}