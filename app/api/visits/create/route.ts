import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visit from "@/models/Visit.model";
import User from "@/models/User.model";
import { Resend } from "resend";


const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { visitorName, hostId, contact, status, purpose, photoUrl } = await req.json();

    const newVisit = await Visit.create({
      visitorName,
      contact,
      hostId,
      purpose,
      photoUrl, 
      status: status || "Pending"
    });

    // TEMPORARY FIX: Bypassing MongoDB host lookup because hosts are now in SQL.
      // We will add SQL email fetching here in the next step.
      const hostEmail = null; 

      /* if (resend && hostEmail) {
        try {
          // ... resend email logic ...
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
        }
      } 
      */

    return NextResponse.json(newVisit, { status: 201 });
  } catch (error: any) {
    console.error("❌ BACKEND CRASH ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}