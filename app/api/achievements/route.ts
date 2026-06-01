import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 0; // Ensure fresh database queries

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(achievements);
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}
