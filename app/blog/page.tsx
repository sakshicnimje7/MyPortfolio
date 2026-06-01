import prisma from "@/lib/prisma";
import BlogIndex from "@/components/blog/BlogIndex";

export const revalidate = 0; // Ensure fresh database queries

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  // Convert Date properties to ISO strings for client component serialization
  const serializedPosts = posts.map(post => ({
    ...post,
    createdAt: post.createdAt.toISOString(),
  }));

  return <BlogIndex posts={serializedPosts} />;
}
