import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Share2,
  Plus,
  Search,
  Flag,
  Sparkles,
  Check,
  X,
  Compass
} from 'lucide-react';
import { store } from '../services/store';
import { Community, CommunityPost } from '../types';

export const CommunitiesView: React.FC = () => {
  const user = store.currentUser;
  const communities = store.communities;
  const posts = store.posts;

  const [activeCommunityId, setActiveCommunityId] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [createPostModalOpen, setCreatePostModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Beginner, MatchAnalysis');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const filteredPosts = posts.filter((p) => {
    const matchesComm =
      activeCommunityId === 'all' || p.communityId === activeCommunityId;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesComm && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const commId = activeCommunityId === 'all' ? communities[0].id : activeCommunityId;
    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    store.createCommunityPost(commId, newTitle, newContent, tagsArray);
    setCreatePostModalOpen(false);
    setNewTitle('');
    setNewContent('');
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    store.addPostComment(postId, commentInput.trim());
    setCommentInput('');
    setActiveCommentPostId(null);
  };

  return (
    <div className="min-h-screen bg-white bg-grid-pattern py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200/70 shadow-2xs">
              <Users className="w-3.5 h-3.5 text-rose-600" />
              Peer Learning Guilds
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight font-display">
              Interest-Based Communities
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-2xl leading-relaxed">
              Share early experiments, discuss tactical breakthroughs, and receive constructive feedback in welcoming interest guilds.
            </p>
          </div>

          <button
            onClick={() => setCreatePostModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 rounded-xl shadow-md shadow-zinc-950/10 hover:shadow-rose-950/20 transition-all hover:-translate-y-0.5 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5 text-rose-400" />
            <span>New Discussion Post</span>
          </button>
        </div>

        {/* Guilds / Community Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {communities.map((comm) => (
            <div
              key={comm.id}
              className={`p-5 rounded-2xl border bg-white shadow-2xs flex flex-col justify-between transition-all card-hover-lift ${
                activeCommunityId === comm.id
                  ? 'border-zinc-950 ring-1 ring-zinc-950'
                  : 'border-zinc-200/90 hover:border-zinc-300'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-700 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-md text-[11px]">
                    {comm.category}
                  </span>
                  <span className="font-mono text-[11px] text-zinc-400">{comm.memberCount} members</span>
                </div>
                <h3 className="font-bold text-zinc-950 text-sm leading-snug">{comm.name}</h3>
                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {comm.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveCommunityId(comm.id)}
                  className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 cursor-pointer"
                >
                  View Feed
                </button>
                <button
                  onClick={() => store.toggleCommunityJoin(comm.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    comm.joined
                      ? 'bg-rose-50 text-rose-700 border border-rose-200/70 shadow-2xs'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {comm.joined ? 'Joined' : 'Join Guild'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCommunityId('all')}
              className={`px-4 py-2 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                activeCommunityId === 'all'
                  ? 'bg-zinc-950 text-white font-semibold shadow-xs'
                  : 'bg-zinc-50 text-zinc-600 border border-zinc-200/80 hover:bg-zinc-100'
              }`}
            >
              All Guild Feeds
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts or tags..."
              className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-zinc-200/90 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 shadow-2xs text-zinc-900"
            />
          </div>
        </div>

        {/* Posts Stream */}
        <div className="space-y-4 max-w-4xl">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-7 shadow-2xs hover:shadow-md transition-all space-y-4"
            >
              {/* Author & Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-9 h-9 rounded-full object-cover border border-zinc-200"
                  />
                  <div>
                    <div className="text-xs font-semibold text-zinc-950 flex items-center gap-1.5">
                      <span>{post.authorName}</span>
                      <span className="text-[10px] text-zinc-400 capitalize">
                        · {post.authorRole}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {new Date(post.createdAt).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    store.reportContent(
                      post.id,
                      'post',
                      post.title,
                      'Flagged by user for moderation'
                    )
                  }
                  className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                  title="Report post"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-950">{post.title}</h3>
                <p className="text-xs text-zinc-600 leading-relaxed mt-1.5 whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono text-zinc-500 bg-zinc-100/70 px-2 py-0.5 rounded-md border border-zinc-200/60"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Reactions & Comments bar */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => store.togglePostLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      post.userLiked
                        ? 'text-rose-700 bg-rose-50 border border-rose-200/60 font-semibold'
                        : 'hover:bg-zinc-100'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.likes} Helpful</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentPostId(
                        activeCommentPostId === post.id ? null : post.id
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-2.5 pt-2">
                {post.comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3.5 bg-zinc-50 rounded-xl text-xs space-y-1 border border-zinc-200/60"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-950">{comm.authorName}</span>
                      <span className="text-[10px] text-zinc-400 capitalize">
                        ({comm.authorRole})
                      </span>
                    </div>
                    <p className="text-zinc-600">{comm.content}</p>
                  </div>
                ))}

                {activeCommentPostId === post.id && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Add a constructive response..."
                      className="flex-1 text-xs px-3.5 py-2 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-zinc-950 rounded-xl hover:bg-zinc-850 cursor-pointer transition-colors shadow-xs"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Create Post Modal */}
        {createPostModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200/90 w-full max-w-lg overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/70">
                <h3 className="font-bold text-sm text-zinc-950 font-display">Post in Community Guild</h3>
                <button
                  onClick={() => setCreatePostModalOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 p-1 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Discussion Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Completed my first match analysis: here's what surprised me"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Content & Reflections
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share your learning takeaway, challenge results, or ask a question..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full text-xs p-3.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-800 mb-1.5">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Sports, Data, Beginner"
                    className="w-full text-xs px-3.5 py-2.5 border border-zinc-200 rounded-xl bg-zinc-50/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all text-zinc-900 font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCreatePostModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-zinc-950 hover:bg-zinc-850 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
