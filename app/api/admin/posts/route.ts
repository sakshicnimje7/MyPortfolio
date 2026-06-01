import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 0; // Ensure fresh database queries

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        tags: body.tags,
        excerpt: body.excerpt,
        content: body.content,
        published: body.published === true,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error("Create post error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
