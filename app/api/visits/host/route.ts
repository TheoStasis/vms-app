import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visit from "@/models/Visit.model";
import User from "@/models/User.model";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await dbConnect();
    // Find the host's database ID based on their email
    const host = await User.findOne({ email });
    if (!host) return NextResponse.json({ error: "Host not found" }, { status: 404 });

    // Fetch ONLY visits where hostId matches this specific host
    const visits = await Visit.find({ hostId: host._id }).sort({ createdAt: -1 });
    
    return NextResponse.json({ hostId: host._id, visits });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}