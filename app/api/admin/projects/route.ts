import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 0; // Ensure fresh database queries

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Fetch projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        shortDesc: body.shortDesc,
        tags: body.tags,
        category: body.category,
        liveUrl: body.liveUrl,
        githubUrl: body.githubUrl || null,
        featured: body.featured === true,
        order: Number(body.order) || 0,
      },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Create project error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
