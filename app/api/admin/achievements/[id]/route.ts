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
      issuer?: string;
      year?: string | null;
      category?: string;
      certified?: boolean;
    } = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.issuer !== undefined) data.issuer = body.issuer;
    if (body.year !== undefined) data.year = body.year || null;
    if (body.category !== undefined) data.category = body.category;
    if (body.certified !== undefined) data.certified = body.certified === true;

    const achievement = await prisma.achievement.update({
      where: { id },
      data,
    });
    return NextResponse.json(achievement);
  } catch (error) {
    console.error("Update achievement error:", error);
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.achievement.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete achievement error:", error);
    return NextResponse.json({ error: "Failed to delete achievement" }, { status: 500 });
  }
}
