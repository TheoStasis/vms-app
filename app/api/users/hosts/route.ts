import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";

export async function GET() {
  try {
    await dbConnect();
    // Fetch all users who can receive visitors, excluding the system roles if you want
    const hosts = await User.find({ role: { $in: ["Host", "Admin"] } }).select("_id name email");
    return NextResponse.json(hosts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}