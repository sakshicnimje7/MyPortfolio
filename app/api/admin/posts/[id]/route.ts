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
      tags?: string;
      excerpt?: string;
      content?: string;
      published?: boolean;
    } = {};
    if (body.title !== undefined) data.title = body.title;
    if (body.slug !== undefined) data.slug = body.slug;
    if (body.tags !== undefined) data.tags = body.tags;
    if (body.excerpt !== undefined) data.excerpt = body.excerpt;
    if (body.content !== undefined) data.content = body.content;
    if (body.published !== undefined) data.published = body.published === true;

    const post = await prisma.blogPost.update({
      where: { id },
      data,
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Update post error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.blogPost.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
