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

    const host = await User.findById(hostId);

    if (resend && host) {
      try {
        await resend.emails.send({
          from: "VMS Portal <onboarding@resend.dev>", 
          to: host.email,
          subject: "New Visitor Waiting",
          html: `<p>Hello ${host.name},</p><p><strong>${visitorName}</strong> is at the reception to see you for a <strong>${purpose}</strong>.</p><p>Please log in to your dashboard to approve or reject the visit.</p>`
        });
      } catch (emailError) {
        console.error("Email failed to send, but visit was saved:", emailError);
      }
    }

    return NextResponse.json(newVisit, { status: 201 });
  } catch (error: any) {
    console.error("❌ BACKEND CRASH ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}