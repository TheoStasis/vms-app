import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visit from "@/models/Visit.model"; 

export async function GET() {
  try {
    await dbConnect();
    
    // Get start and end of the current day
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch visits created today, and populate the Host's name
    const visits = await Visit.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    }).populate("hostId", "name email").sort({ createdAt: -1 });

    return NextResponse.json(visits);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}