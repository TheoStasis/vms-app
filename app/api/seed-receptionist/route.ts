import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User.model";

export async function GET() {
  await dbConnect();
  
  const exists = await User.findOne({ email: "reception@vms.com" });
  if (exists) return NextResponse.json({ message: "Receptionist already exists!" });
  
  const hashedPassword = await bcrypt.hash("reception123", 10);
  
  await User.create({ 
    name: "Front Desk Pam", 
    email: "reception@vms.com", 
    password: hashedPassword, 
    role: "Receptionist" 
  });
  
  return NextResponse.json({ message: "Receptionist created!" }, { status: 201 });
}