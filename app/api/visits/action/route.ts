import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visit from "@/models/Visit.model";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const visitId = searchParams.get("id");
    const action = searchParams.get("action"); // Will be 'Approved' or 'Rejected'

    if (!visitId || !action) {
      return new NextResponse("Missing parameters", { status: 400 });
    }

    await dbConnect();
    
    // Update the visitor's status
    const updatedVisit = await Visit.findByIdAndUpdate(
      visitId, 
      { status: action }, 
      { new: true }
    );

    if (!updatedVisit) {
      return new NextResponse("Visitor not found", { status: 404 });
    }

    // Return a clean, simple HTML screen to the host so they know it worked
    const bgColor = action === "Approved" ? "#16a34a" : "#dc2626";
    
    return new NextResponse(`
      <html>
        <body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f8fafc; margin: 0;">
          <div style="text-align: center; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h1 style="color: ${bgColor};">${action}!</h1>
            <p style="color: #475569; font-size: 18px;">The receptionist has been notified.</p>
            <p style="color: #94a3b8; font-size: 14px;">You can close this window.</p>
          </div>
        </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html" },
    });

  } catch (error: any) {
    console.error("Action error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}