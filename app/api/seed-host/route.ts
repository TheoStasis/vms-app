import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";

export async function GET() {
  await dbConnect();
  
  const exists = await User.findOne({ email: "employee@vms.com" });
  if (exists) return NextResponse.json({ message: "Host already exists!" });
  
  const hashedPassword = await bcrypt.hash("host123", 10);
  
  await User.create({ 
    name: "Tony Stark", 
    email: "employee@vms.com", 
    password: hashedPassword, 
    role: "Host" 
  });
  
  return NextResponse.json({ message: "Host created!" }, { status: 201 });
}