'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  createdAt: Date | string;
}

interface BlogIndexProps {
  posts: BlogPost[];
}

export default function BlogIndex({ posts }: BlogIndexProps) {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Extract all unique tags
  const allTags = ['All'];
  posts.forEach(post => {
    post.tags.split(',').forEach(tag => {
      const trimmed = tag.trim();
      if (trimmed && !allTags.includes(trimmed)) {
        allTags.push(trimmed);
      }
    });
  });

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (selectedTag === 'All') return true;
    return post.tags.split(',').map(t => t.trim().toLowerCase()).includes(selectedTag.toLowerCase());
  });

  const getReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  };

  const formatDate = (dateStr: Date | string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] py-24 px-6 md:px-12 relative z-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        {/* Top Header */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="font-dm text-xs font-medium text-[#c4862a] hover:text-[#3d5e3b] transition-colors mb-4 inline-block select-none"
          >
            ← Back to portfolio
          </Link>
          <h1 className="font-cormorant font-semibold text-5xl sm:text-6xl text-[#3d5e3b] leading-tight">
            The Writing
          </h1>
          <p className="font-dm font-light text-base sm:text-lg text-[#8fa68a] max-w-xl leading-relaxed">
            Thoughts on enterprise architectures, SAP ecosystem extensions, modern frontend development, and clean code.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-full font-dm text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-[#3d5e3b] text-[#f7f5ef] shadow-sm'
                    : 'bg-[#eae8df] text-[#5c7a5a] hover:bg-[#d4d0c4]/60'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Blog Post Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredPosts.map(post => {
              const tagsList = post.tags.split(',').map(t => t.trim());
              const readingTime = getReadingTime(post.content);

              return (
                <div
                  key={post.id}
                  className="bg-[#f7f5ef] border border-[#d4d0c4] hover:border-[#c4862a] rounded-[4px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between select-none"
                >
                  <div className="flex flex-col gap-4">
                    {/* Date and Reading Time */}
                    <div className="flex items-center gap-2.5 font-mono text-[10px] uppercase text-[#8fa68a] tracking-wider">
                      <span>{formatDate(post.createdAt)}</span>
                      <span>·</span>
                      <span>{readingTime} min read</span>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`} className="group">
                      <h2 className="font-cormorant font-semibold text-2xl sm:text-3xl text-[#1a1a16] group-hover:text-[#3d5e3b] transition-colors leading-tight">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="font-dm font-light text-sm text-[#5c7a5a] leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Tags and Footer */}
                  <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-[#d4d0c4]/20">
                    {tagsList.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-[#eae8df] text-[#3d5e3b] font-mono text-[9px] rounded-full uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-[var(--cream-3)] rounded-lg">
            <p className="font-dm text-[var(--sage-mid)] italic text-sm">
              {posts.length === 0 ? "No articles published yet." : "No blog posts found under this tag."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
