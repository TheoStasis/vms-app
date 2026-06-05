import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect"; 
import User from "@/models/User.model"; 

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({ error: "Missing userId or role" }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: role },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });
  } catch (error: any) {
    console.error("Role update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}