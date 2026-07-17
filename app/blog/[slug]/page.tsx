import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import prisma from "@/lib/prisma";

export const revalidate = 0; // Ensure fresh database queries

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

const customComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="font-cormorant font-semibold text-3xl sm:text-4xl text-[#3d5e3b] mt-10 mb-4 leading-tight" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="font-cormorant font-semibold text-2xl sm:text-3xl text-[#3d5e3b] mt-8 mb-3 leading-tight" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-cormorant font-semibold text-xl sm:text-2xl text-[#3d5e3b] mt-6 mb-2 leading-tight" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="font-dm font-light text-[15px] sm:text-[16px] text-[#5c7a5a] leading-[1.9] mb-6" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="font-mono bg-[#eae8df] text-[#3d5e3b] px-1.5 py-0.5 rounded text-[13px] sm:text-[14px] font-medium" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="font-mono bg-[#eae8df]/50 text-[#3d5e3b] p-4 rounded-md overflow-x-auto text-[13px] sm:text-[14px] mb-6 border border-[#d4d0c4]/45" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-[3px] border-[#c4862a] bg-[#f0d4a8]/10 px-5 py-4 my-6 italic text-[#5c7a5a] rounded-r" {...props} />
  ),
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.published) {
    notFound();
  }

  // Calculate reading time
  const words = post.content.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] py-24 px-6 md:px-12 relative z-20">
      <article className="max-w-2xl mx-auto flex flex-col">
        {/* Navigation & Header Info */}
        <div className="flex flex-col gap-5 border-b border-[#d4d0c4]/45 pb-8 mb-8">
          <Link
            href="/blog"
            className="font-dm text-xs font-medium text-[#c4862a] hover:text-[#3d5e3b] transition-colors inline-block select-none"
          >
            ← Back to blog
          </Link>

          <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase text-[#8fa68a] tracking-wider">
            <span>{formatDate(post.createdAt)}</span>
            <span>·</span>
            <span>{readingTime} min read</span>
          </div>

          <h1 className="font-cormorant font-semibold text-4xl sm:text-5xl text-[#3d5e3b] leading-tight">
            {post.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.split(',').map(tag => (
              <span
                key={tag}
                className="px-2.5 py-0.5 bg-[#eae8df] text-[#3d5e3b] font-mono text-[9px] rounded-full uppercase tracking-wider"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>

        {/* Content body rendered via Server-Side MDX */}
        <div className="mdx-content">
          <MDXRemote source={post.content} components={customComponents} />
        </div>
      </article>
    </div>
  );
}
