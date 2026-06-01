import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 0; // Ensure fresh database queries

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Fetch achievements error:", error);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const achievement = await prisma.achievement.create({
      data: {
        title: body.title,
        issuer: body.issuer,
        year: body.year || null,
        category: body.category,
        certified: body.certified === true,
      },
    });
    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Create achievement error:", error);
    return NextResponse.json({ error: "Failed to create achievement" }, { status: 500 });
  }
}
