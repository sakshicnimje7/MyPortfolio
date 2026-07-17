import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { path } = await request.json();
    if (!path || path.startsWith('/admin')) {
      return NextResponse.json({ error: "Path is required and cannot be an admin route" }, { status: 400 });
    }
    const pageView = await prisma.pageView.create({
      data: { path },
    });
    return NextResponse.json(pageView);
  } catch (error) {
    console.error("Save pageview error:", error);
    return NextResponse.json({ error: "Failed to save page view" }, { status: 500 });
  }
}
