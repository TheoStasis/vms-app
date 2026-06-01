import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";

export async function GET() {
  await dbConnect();
  const exists = await User.findOne({ email: "admin@vms.com" });
  if (exists) return NextResponse.json({ message: "Admin already exists!" });
  
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create({ name: "System Admin", email: "admin@vms.com", password: hashedPassword, role: "Admin" });
  return NextResponse.json({ message: "Admin created!" }, { status: 201 });
}