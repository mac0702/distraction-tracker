import { connectToDatabase } from "@/lib/mongodb";
import { DistractionEvent } from "@/models/DistractionEvent";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const data = await req.json();
    const event = await DistractionEvent.create({
      ...data,
      userId: (session.user as { id: string }).id,
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    interface QueryType {
      userId: string;
      timestamp?: {
        $gte: number;
        $lte: number;
      };
    }

    const query: {
      userId: string;
      timestamp?: { $gte: number; $lte: number };
    } = { userId: (session.user as { id: string }).id };
    if (startDate && endDate) {
      query.timestamp = {
        $gte: parseInt(startDate),
        $lte: parseInt(endDate),
      };
    }

    const events = await DistractionEvent.find(query)
      .sort({ timestamp: -1 })
      .limit(100);

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 }
    );
  }
}
