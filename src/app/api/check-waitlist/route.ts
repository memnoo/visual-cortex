import { createClient } from "@/lib/database/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if email exists in waitlist with pending status
    const { data: waitlistEntry, error } = await supabase
      .from("waitlist")
      .select("email, status")
      .eq("email", email)
      .eq("status", "pending")
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error checking waitlist:", error);
      return NextResponse.json(
        { error: "Failed to check waitlist status" },
        { status: 500 }
      );
    }

    const isPending = !!waitlistEntry;

    return NextResponse.json({
      isPending,
      email: waitlistEntry?.email,
      status: waitlistEntry?.status,
    });
  } catch (error) {
    console.error("Error in check-waitlist API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
