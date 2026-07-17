import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 0; // Ensure fresh database queries

export async function GET() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const pageViews = await prisma.pageView.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by path and count
    const countsMap: Record<string, number> = {};
    pageViews.forEach((view) => {
      countsMap[view.path] = (countsMap[view.path] || 0) + 1;
    });

    const chartData = Object.entries(countsMap).map(([path, count]) => ({
      name: path,
      views: count,
    }));

    return NextResponse.json({
      chartData,
      totalViews: pageViews.length,
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
