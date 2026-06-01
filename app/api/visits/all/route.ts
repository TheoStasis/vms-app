import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visit from "@/models/Visit.model";

export async function GET() {
  try {
    await dbConnect();
    const visits = await Visit.find({}).populate("hostId", "name email").sort({ createdAt: -1 });
    return NextResponse.json(visits);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}