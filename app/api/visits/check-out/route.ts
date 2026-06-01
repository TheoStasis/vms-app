import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visit from "@/models/Visit.model";

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { visitId } = await req.json();

    const updated = await Visit.findByIdAndUpdate(
      visitId,
      { status: "Completed", exitTime: Date.now() },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}