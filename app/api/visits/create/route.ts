import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visit from "@/models/Visit.model";
import nodemailer from "nodemailer";

// Create the Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { visitorName, hostId, contact, status, purpose, photoUrl, hostEmail } = await req.json();

    // 1. Create the visit in MongoDB
    const newVisit = await Visit.create({
      visitorName,
      contact,
      hostId,
      purpose,
      photoUrl, 
      status: status || "Pending"
    });

    // 2. Send the Link via Gmail SMTP
    if (hostEmail) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const approveLink = `${baseUrl}/api/visits/action?id=${newVisit._id}&action=Approved`;
      const rejectLink = `${baseUrl}/api/visits/action?id=${newVisit._id}&action=Rejected`;

      try {
        await transporter.sendMail({
          from: `"VMS" <${process.env.GMAIL_USER}>`,
          to: hostEmail, // Dynamic host email
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
        console.error("Failed to send Gmail SMTP email:", emailError);
      }
    }

    return NextResponse.json(newVisit, { status: 201 });
  } catch (error: any) {
    console.error("❌ BACKEND CRASH ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}