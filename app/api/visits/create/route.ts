import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visit from "@/models/Visit.model";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    await dbConnect();
    // 1. Destructure the payload, now including hostEmail
    const { visitorName, hostId, contact, status, purpose, photoUrl, hostEmail } = await req.json();

    // 2. Create the visit in MongoDB
    const newVisit = await Visit.create({
      visitorName,
      contact,
      hostId,
      purpose,
      photoUrl, 
      status: status || "Pending"
    });

    // 3. Send the Magic Link Email
    if (resend && hostEmail) {
      // Use your live Vercel domain if available, otherwise fallback to localhost for testing
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      
      const approveLink = `${baseUrl}/api/visits/action?id=${newVisit._id}&action=Approved`;
      const rejectLink = `${baseUrl}/api/visits/action?id=${newVisit._id}&action=Rejected`;

      try {
        await resend.emails.send({
          from: "VMS <onboarding@resend.dev>", // Update this if you have a verified domain on Resend
          to: "tanay84367535@gmail.com", //hostEmail
          subject: `New Visitor: ${visitorName} is here`,
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <h2>You have a visitor at reception.</h2>
              <p><strong>Name:</strong> ${visitorName}</p>
              <p><strong>Purpose:</strong> ${purpose}</p>
              <p><strong>Contact:</strong> ${contact}</p>
              ${photoUrl ? `<br/><img src="${photoUrl}" width="150" style="border-radius:8px; border: 1px solid #ddd;" /><br/>` : ''}
              
              <br/><br/>
              <a href="${approveLink}" style="display: inline-block; padding: 12px 24px; background-color: #16a34a; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 12px;">APPROVE</a>
              
              <a href="${rejectLink}" style="display: inline-block; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">REJECT</a>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // We don't throw an error here so the visit still gets successfully created in the DB
      }
    }

    return NextResponse.json(newVisit, { status: 201 });
  } catch (error: any) {
    console.error("❌ BACKEND CRASH ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}