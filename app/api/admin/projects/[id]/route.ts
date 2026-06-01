import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const data: {
      title?: string;
      slug?: string;
      description?: string;
      shortDesc?: string;
      tags?: string;
      category?: string;
      liveUrl?: string;
      githubUrl?: string | null;
      featured?: boolean;
      order?: number;
    } = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.description !== undefined) data.description = body.description;
    if (body.shortDesc !== undefined) data.shortDesc = body.shortDesc;
    if (body.tags !== undefined) data.tags = body.tags;
    if (body.category !== undefined) data.category = body.category;
    if (body.liveUrl !== undefined) data.liveUrl = body.liveUrl;
    if (body.githubUrl !== undefined) data.githubUrl = body.githubUrl || null;
    if (body.featured !== undefined) data.featured = body.featured === true;
    if (body.order !== undefined) data.order = Number(body.order) || 0;

    const project = await prisma.project.update({
      where: { id },
      data,
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
