import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visit from "@/models/Visit.model";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { visitId, status } = await req.json();

    // Update the visit document
    const updatedVisit = await Visit.findByIdAndUpdate(
      visitId,
      { status },
      { new: true }
    );

    if (!updatedVisit) return NextResponse.json({ error: "Visit not found" }, { status: 404 });

    // Notify Receptionist (Only if Resend is active)
    if (resend) {
      try {
        await resend.emails.send({
          from: "VMS Portal <onboarding@resend.dev>",
          to: "reception@vms.com", // Hardcoded to your receptionist seed email
          subject: `Visitor ${status}`,
          html: `<p>The host has <strong>${status.toLowerCase()}</strong> the visit for <strong>${updatedVisit.visitorName}</strong>.</p>`
        });
      } catch (e) {
        console.error("Email failed:", e);
      }
    }

    return NextResponse.json(updatedVisit);
  } catch (error: any) {
    console.error("❌ UPDATE STATUS ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}