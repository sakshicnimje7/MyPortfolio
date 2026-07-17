'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDesc: string;
  tags: string;
  category: string;
  liveUrl: string;
  githubUrl: string | null;
  featured: boolean;
  order: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  tags: string;
  excerpt: string;
  content: string;
  published: boolean;
}

interface Achievement {
  id: string;
  title: string;
  issuer: string;
  year: string | null;
  category: string;
  certified: boolean;
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [chartData, setChartData] = useState<{ name: string; views: number }[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [mounted, setMounted] = useState(false);

  const [loading, setLoading] = useState(true);

  // Form states
  const [projectForm, setProjectForm] = useState({
    id: '',
    title: '',
    slug: '',
    description: '',
    shortDesc: '',
    tags: '',
    category: 'SAP',
    liveUrl: '#',
    githubUrl: '',
    featured: false,
    order: 0,
  });

  const [postForm, setPostForm] = useState({
    id: '',
    title: '',
    slug: '',
    tags: '',
    excerpt: '',
    content: '',
    published: false,
  });

  const [achievementForm, setAchievementForm] = useState({
    id: '',
    title: '',
    issuer: '',
    year: '',
    category: 'SAP',
    certified: false,
  });

  // Edit mode toggles
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingAchievementId, setEditingAchievementId] = useState<string | null>(null);

  // Fetch all CMS data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProj, resPosts, resAch, resAnalytics] = await Promise.all([
        fetch('/api/admin/projects'),
        fetch('/api/admin/posts'),
        fetch('/api/admin/achievements'),
        fetch('/api/admin/analytics'),
      ]);
      const [projData, postsData, achData, analyticsData] = await Promise.all([
        resProj.json(),
        resPosts.json(),
        resAch.json(),
        resAnalytics.json(),
      ]);

      if (Array.isArray(projData)) setProjects(projData);
      if (Array.isArray(postsData)) setPosts(postsData);
      if (Array.isArray(achData)) setAchievements(achData);
      if (analyticsData && !analyticsData.error) {
        setChartData(analyticsData.chartData || []);
        setTotalViews(analyticsData.totalViews || 0);
      }
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setMounted(true);
  }, []);

  // -------------------------------------------------------------
  // Project CRUD operations
  // -------------------------------------------------------------
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !projectForm.title.trim() ||
      !projectForm.slug.trim() ||
      !projectForm.description.trim() ||
      !projectForm.shortDesc.trim() ||
      !projectForm.tags.trim()
    ) {
      alert("All fields are required and cannot be blank.");
      return;
    }
    try {
      const isEditing = !!editingProjectId;
      const url = isEditing
        ? `/api/admin/projects/${editingProjectId}`
        : '/api/admin/projects';

      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectForm),
      });

      if (response.ok) {
        setProjectForm({
          id: '',
          title: '',
          slug: '',
          description: '',
          shortDesc: '',
          tags: '',
          category: 'SAP',
          liveUrl: '#',
          githubUrl: '',
          featured: false,
          order: 0,
        });
        setEditingProjectId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectEdit = (proj: Project) => {
    setEditingProjectId(proj.id);
    setProjectForm({
      id: proj.id,
      title: proj.title,
      slug: proj.slug,
      description: proj.description,
      shortDesc: proj.shortDesc,
      tags: proj.tags,
      category: proj.category,
      liveUrl: proj.liveUrl,
      githubUrl: proj.githubUrl || '',
      featured: proj.featured,
      order: proj.order,
    });
  };

  const handleProjectDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleProjectFeatured = async (proj: Project) => {
    try {
      const res = await fetch(`/api/admin/projects/${proj.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !proj.featured }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // Post CRUD operations
  // -------------------------------------------------------------
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.excerpt.trim() || !postForm.content.trim()) {
      alert("Title, excerpt, and content are required and cannot be blank.");
      return;
    }
    try {
      const isEditing = !!editingPostId;
      const url = isEditing
        ? `/api/admin/posts/${editingPostId}`
        : '/api/admin/posts';

      const method = isEditing ? 'PATCH' : 'POST';

      const slugify = (text: string) =>
        text
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-');

      const payload = {
        ...postForm,
        slug: postForm.slug.trim() || slugify(postForm.title),
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setPostForm({
          id: '',
          title: '',
          slug: '',
          tags: '',
          excerpt: '',
          content: '',
          published: false,
        });
        setEditingPostId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostEdit = (post: BlogPost) => {
    setEditingPostId(post.id);
    setPostForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      tags: post.tags,
      excerpt: post.excerpt,
      content: post.content,
      published: post.published,
    });
  };

  const handlePostDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePostPublished = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // Achievement CRUD operations
  // -------------------------------------------------------------
  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementForm.title.trim() || !achievementForm.issuer.trim() || !achievementForm.category.trim()) {
      alert("Title, issuer, and category are required and cannot be blank.");
      return;
    }
    try {
      const isEditing = !!editingAchievementId;
      const url = isEditing
        ? `/api/admin/achievements/${editingAchievementId}`
        : '/api/admin/achievements';

      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(achievementForm),
      });

      if (response.ok) {
        setAchievementForm({
          id: '',
          title: '',
          issuer: '',
          year: '',
          category: 'SAP',
          certified: false,
        });
        setEditingAchievementId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAchievementEdit = (ach: Achievement) => {
    setEditingAchievementId(ach.id);
    setAchievementForm({
      id: ach.id,
      title: ach.title,
      issuer: ach.issuer,
      year: ach.year || '',
      category: ach.category,
      certified: ach.certified,
    });
  };

  const handleAchievementDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    try {
      const res = await fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center font-mono text-xs opacity-60">
        Loading CMS Panel...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5ef] font-dm text-[14px] text-[#1a1a16] p-6 sm:p-12 relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-[#d4d0c4] pb-6">
          <div>
            <h1 className="font-cormorant font-semibold text-3xl text-[#3d5e3b]">
              CMS Admin Panel
            </h1>
            <p className="text-xs text-[#5c7a5a] mt-1 italic">
              Utilitarian manager. Direct SQLite interface.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 border border-[#d4d0c4] hover:border-[#c4862a] text-[#5c7a5a] hover:text-[#3d5e3b] font-medium transition-all duration-300 rounded-[2px] text-xs select-none text-center self-start sm:self-center"
          >
            ← View Portfolio Site
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-[#eae8df] border border-[#d4d0c4]/60 p-5 rounded">
            <h4 className="font-mono text-xs text-[#8fa68a] uppercase tracking-wider mb-1">Total Projects</h4>
            <span className="font-cormorant font-semibold text-4xl text-[#3d5e3b]">{projects.length}</span>
          </div>
          <div className="bg-[#eae8df] border border-[#d4d0c4]/60 p-5 rounded">
            <h4 className="font-mono text-xs text-[#8fa68a] uppercase tracking-wider mb-1">Total Blog Posts</h4>
            <span className="font-cormorant font-semibold text-4xl text-[#3d5e3b]">{posts.length}</span>
          </div>
          <div className="bg-[#eae8df] border border-[#d4d0c4]/60 p-5 rounded">
            <h4 className="font-mono text-xs text-[#8fa68a] uppercase tracking-wider mb-1">Page Views (30 Days)</h4>
            <span className="font-cormorant font-semibold text-4xl text-[#3d5e3b]">{totalViews}</span>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="border border-[#d4d0c4] rounded p-6 bg-[#f7f5ef] flex flex-col gap-6">
          <div>
            <h2 className="font-cormorant font-semibold text-2xl text-[#3d5e3b]">Views per Page (Last 30 Days)</h2>
            <p className="text-xs text-[#5c7a5a] mt-1 italic">Real-time analytics collected from route shifts.</p>
          </div>
          <div className="w-full h-[300px]">
            {mounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--cream-3)" opacity={0.5} />
                  <XAxis dataKey="name" stroke="#5c7a5a" fontSize={11} tickLine={false} />
                  <YAxis stroke="#5c7a5a" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--cream-2)',
                      borderColor: 'var(--cream-3)',
                      color: 'var(--ink)'
                    }}
                  />
                  <Bar dataKey="views" fill="#3d5e3b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center border border-dashed border-[#d4d0c4] rounded text-[#5c7a5a] italic text-xs">
                No view data recorded yet in the last 30 days.
              </div>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* PROJECTS SECTION */}
        {/* ========================================================= */}
        <div className="border border-[#d4d0c4] rounded p-6 bg-[#f7f5ef] flex flex-col gap-6">
          <h2 className="font-cormorant font-semibold text-2xl text-[#3d5e3b]">Projects</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[#d4d0c4]">
              <thead>
                <tr className="bg-[#eae8df] font-mono text-xs uppercase tracking-wider border-b border-[#d4d0c4]">
                  <th className="p-3 border-r border-[#d4d0c4]">Title</th>
                  <th className="p-3 border-r border-[#d4d0c4]">Category</th>
                  <th className="p-3 border-r border-[#d4d0c4] text-center">Featured</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(proj => (
                  <tr key={proj.id} className="border-b border-[#d4d0c4] hover:bg-[#eae8df]/30 transition-colors">
                    <td className="p-3 border-r border-[#d4d0c4] font-medium">{proj.title}</td>
                    <td className="p-3 border-r border-[#d4d0c4] font-mono text-xs">{proj.category}</td>
                    <td className="p-3 border-r border-[#d4d0c4] text-center">
                      <button
                        onClick={() => toggleProjectFeatured(proj)}
                        className={`px-3 py-1 font-mono text-[10px] uppercase rounded-full ${proj.featured
                            ? 'bg-[#3d5e3b] text-[#f7f5ef]'
                            : 'bg-[#eae8df] text-[#5c7a5a]'
                          }`}
                      >
                        {proj.featured ? 'Yes' : 'No'}
                      </button>
                    </td>
                    <td className="p-3 text-center flex justify-center gap-3">
                      <button
                        onClick={() => handleProjectEdit(proj)}
                        className="text-[#c4862a] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleProjectDelete(proj.id)}
                        className="text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add/Edit Project Form */}
          <form onSubmit={handleProjectSubmit} className="flex flex-col gap-4 border-t border-[#d4d0c4] pt-6">
            <h3 className="font-cormorant font-semibold text-lg text-[#3d5e3b]">
              {editingProjectId ? 'Edit Project' : 'Add New Project'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise REST API Gateway"
                  value={projectForm.title}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. enterprise-rest-api-gateway"
                  value={projectForm.slug}
                  onChange={e => setProjectForm({ ...projectForm, slug: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs uppercase text-[#5c7a5a]">Detailed Description</label>
              <textarea
                required
                rows={3}
                placeholder="Write description..."
                value={projectForm.description}
                onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Short Description (One-liner)</label>
                <input
                  type="text"
                  required
                  placeholder="A brief summary..."
                  value={projectForm.shortDesc}
                  onChange={e => setProjectForm({ ...projectForm, shortDesc: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Tags (Comma-separated)</label>
                <input
                  type="text"
                  required
                  placeholder="SAP BTP, Node.js, CAP"
                  value={projectForm.tags}
                  onChange={e => setProjectForm({ ...projectForm, tags: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Category</label>
                <select
                  value={projectForm.category}
                  onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                >
                  <option value="SAP">SAP</option>
                  <option value="Java">Java</option>
                  <option value="AI">AI</option>
                  <option value="Frontend">Frontend</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Live View URL</label>
                <input
                  type="text"
                  required
                  value={projectForm.liveUrl}
                  onChange={e => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">GitHub URL</label>
                <input
                  type="text"
                  placeholder="Optional repository link"
                  value={projectForm.githubUrl}
                  onChange={e => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Order Number</label>
                <input
                  type="number"
                  required
                  value={projectForm.order}
                  onChange={e => setProjectForm({ ...projectForm, order: Number(e.target.value) || 0 })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="featured"
                checked={projectForm.featured}
                onChange={e => setProjectForm({ ...projectForm, featured: e.target.checked })}
                className="w-4 h-4 accent-[#3d5e3b]"
              />
              <label htmlFor="featured" className="font-mono text-xs uppercase text-[#5c7a5a] select-none">
                Featured Card
              </label>
            </div>

            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#3d5e3b] text-[#f7f5ef] font-medium rounded-[2px] hover:bg-[#5c7a5a] transition-colors"
              >
                {editingProjectId ? 'Save Changes' : 'Add Project'}
              </button>
              {editingProjectId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProjectId(null);
                    setProjectForm({
                      id: '',
                      title: '',
                      slug: '',
                      description: '',
                      shortDesc: '',
                      tags: '',
                      category: 'SAP',
                      liveUrl: '#',
                      githubUrl: '',
                      featured: false,
                      order: 0,
                    });
                  }}
                  className="px-6 py-2.5 border border-[#d4d0c4] text-[#5c7a5a] font-medium rounded-[2px] hover:bg-[#eae8df] transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ========================================================= */}
        {/* BLOG POSTS SECTION */}
        {/* ========================================================= */}
        <div className="border border-[#d4d0c4] rounded p-6 bg-[#f7f5ef] flex flex-col gap-6">
          <h2 className="font-cormorant font-semibold text-2xl text-[#3d5e3b]">Blog Posts</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[#d4d0c4]">
              <thead>
                <tr className="bg-[#eae8df] font-mono text-xs uppercase tracking-wider border-b border-[#d4d0c4]">
                  <th className="p-3 border-r border-[#d4d0c4]">Title</th>
                  <th className="p-3 border-r border-[#d4d0c4] text-center">Published</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-[#d4d0c4] hover:bg-[#eae8df]/30 transition-colors">
                    <td className="p-3 border-r border-[#d4d0c4] font-medium">{post.title}</td>
                    <td className="p-3 border-r border-[#d4d0c4] text-center">
                      <button
                        onClick={() => togglePostPublished(post)}
                        className={`px-3 py-1 font-mono text-[10px] uppercase rounded-full ${post.published
                            ? 'bg-[#3d5e3b] text-[#f7f5ef]'
                            : 'bg-[#eae8df] text-[#5c7a5a]'
                          }`}
                      >
                        {post.published ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="p-3 text-center flex justify-center gap-3">
                      <button
                        onClick={() => handlePostEdit(post)}
                        className="text-[#c4862a] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handlePostDelete(post.id)}
                        className="text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add/Edit Post Form */}
          <form onSubmit={handlePostSubmit} className="flex flex-col gap-4 border-t border-[#d4d0c4] pt-6">
            <h3 className="font-cormorant font-semibold text-lg text-[#3d5e3b]">
              {editingPostId ? 'Edit Post' : 'Add New Blog Post'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Getting Started with ABAP Cloud"
                  value={postForm.title}
                  onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. getting-started-with-abap-cloud"
                  value={postForm.slug}
                  onChange={e => setPostForm({ ...postForm, slug: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Tags (Comma-separated)</label>
                <input
                  type="text"
                  required
                  placeholder="SAP, ABAP, Cloud"
                  value={postForm.tags}
                  onChange={e => setPostForm({ ...postForm, tags: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Excerpt</label>
                <input
                  type="text"
                  required
                  placeholder="A short summary of the post..."
                  value={postForm.excerpt}
                  onChange={e => setPostForm({ ...postForm, excerpt: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-mono text-xs uppercase text-[#5c7a5a]">Post Content (MDX)</label>
              <textarea
                required
                rows={12}
                placeholder="Write your markdown here..."
                value={postForm.content}
                onChange={e => setPostForm({ ...postForm, content: e.target.value })}
                className="p-3 border border-[#d4d0c4] bg-[#f7f5ef] rounded font-mono text-xs focus:outline-none focus:border-[#3d5e3b] resize-y"
              />
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="published"
                checked={postForm.published}
                onChange={e => setPostForm({ ...postForm, published: e.target.checked })}
                className="w-4 h-4 accent-[#3d5e3b]"
              />
              <label htmlFor="published" className="font-mono text-xs uppercase text-[#5c7a5a] select-none">
                Publish immediately (Publicly visible)
              </label>
            </div>

            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#3d5e3b] text-[#f7f5ef] font-medium rounded-[2px] hover:bg-[#5c7a5a] transition-colors"
              >
                {editingPostId ? 'Save Changes' : 'Add Post'}
              </button>
              {editingPostId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPostId(null);
                    setPostForm({
                      id: '',
                      title: '',
                      slug: '',
                      tags: '',
                      excerpt: '',
                      content: '',
                      published: false,
                    });
                  }}
                  className="px-6 py-2.5 border border-[#d4d0c4] text-[#5c7a5a] font-medium rounded-[2px] hover:bg-[#eae8df] transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ========================================================= */}
        {/* ACHIEVEMENTS SECTION */}
        {/* ========================================================= */}
        <div className="border border-[#d4d0c4] rounded p-6 bg-[#f7f5ef] flex flex-col gap-6">
          <h2 className="font-cormorant font-semibold text-2xl text-[#3d5e3b]">Achievements & Certifications</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-[#d4d0c4]">
              <thead>
                <tr className="bg-[#eae8df] font-mono text-xs uppercase tracking-wider border-b border-[#d4d0c4]">
                  <th className="p-3 border-r border-[#d4d0c4]">Title</th>
                  <th className="p-3 border-r border-[#d4d0c4]">Issuer</th>
                  <th className="p-3 border-r border-[#d4d0c4]">Category</th>
                  <th className="p-3 border-r border-[#d4d0c4] text-center">Certified Tag</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map(ach => (
                  <tr key={ach.id} className="border-b border-[#d4d0c4] hover:bg-[#eae8df]/30 transition-colors">
                    <td className="p-3 border-r border-[#d4d0c4] font-medium">{ach.title}</td>
                    <td className="p-3 border-r border-[#d4d0c4]">{ach.issuer}</td>
                    <td className="p-3 border-r border-[#d4d0c4] font-mono text-xs">{ach.category}</td>
                    <td className="p-3 border-r border-[#d4d0c4] text-center font-mono text-xs">
                      {ach.certified ? 'YES' : 'NO'}
                    </td>
                    <td className="p-3 text-center flex justify-center gap-3">
                      <button
                        onClick={() => handleAchievementEdit(ach)}
                        className="text-[#c4862a] hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAchievementDelete(ach.id)}
                        className="text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add/Edit Achievement Form */}
          <form onSubmit={handleAchievementSubmit} className="flex flex-col gap-4 border-t border-[#d4d0c4] pt-6">
            <h3 className="font-cormorant font-semibold text-lg text-[#3d5e3b]">
              {editingAchievementId ? 'Edit Certification' : 'Add New Achievement/Cert'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DSA Using Java"
                  value={achievementForm.title}
                  onChange={e => setAchievementForm({ ...achievementForm, title: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Issuer</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Infosys / SAP"
                  value={achievementForm.issuer}
                  onChange={e => setAchievementForm({ ...achievementForm, issuer: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2025 (Optional)"
                  value={achievementForm.year}
                  onChange={e => setAchievementForm({ ...achievementForm, year: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs uppercase text-[#5c7a5a]">Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAP / Course"
                  value={achievementForm.category}
                  onChange={e => setAchievementForm({ ...achievementForm, category: e.target.value })}
                  className="p-2 border border-[#d4d0c4] bg-[#f7f5ef] rounded focus:outline-none focus:border-[#3d5e3b]"
                />
              </div>
              <div className="flex flex-col justify-end pb-2 pl-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="certified"
                    checked={achievementForm.certified}
                    onChange={e => setAchievementForm({ ...achievementForm, certified: e.target.checked })}
                    className="w-4 h-4 accent-[#3d5e3b]"
                  />
                  <label htmlFor="certified" className="font-mono text-xs uppercase text-[#5c7a5a] select-none">
                    ★ Certified Tag (Hero layout)
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#3d5e3b] text-[#f7f5ef] font-medium rounded-[2px] hover:bg-[#5c7a5a] transition-colors"
              >
                {editingAchievementId ? 'Save Changes' : 'Add Certification'}
              </button>
              {editingAchievementId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAchievementId(null);
                    setAchievementForm({
                      id: '',
                      title: '',
                      issuer: '',
                      year: '',
                      category: 'SAP',
                      certified: false,
                    });
                  }}
                  className="px-6 py-2.5 border border-[#d4d0c4] text-[#5c7a5a] font-medium rounded-[2px] hover:bg-[#eae8df] transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
