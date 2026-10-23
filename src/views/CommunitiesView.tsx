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
  X
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
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              Peer Learning Guilds
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Interest-Based Communities
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Share early experiments, discuss tactical breakthroughs, and receive constructive feedback in welcoming interest guilds.
            </p>
          </div>

          <button
            onClick={() => setCreatePostModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Discussion Post</span>
          </button>
        </div>

        {/* Guilds / Community Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {communities.map((comm) => (
            <div
              key={comm.id}
              className={`p-4 rounded-xl border bg-white shadow-2xs flex flex-col justify-between transition-colors ${
                activeCommunityId === comm.id
                  ? 'border-emerald-600 ring-1 ring-emerald-600'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-emerald-800">{comm.category}</span>
                  <span className="font-mono text-[11px]">{comm.memberCount} members</span>
                </div>
                <h3 className="font-bold text-slate-900 text-xs leading-snug">{comm.name}</h3>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {comm.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setActiveCommunityId(comm.id)}
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                >
                  View Feed
                </button>
                <button
                  onClick={() => store.toggleCommunityJoin(comm.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    comm.joined
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {comm.joined ? 'Joined' : 'Join Guild'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveCommunityId('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeCommunityId === 'all'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              All Guild Feeds
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search posts or tags..."
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Posts Stream */}
        <div className="space-y-4 max-w-4xl">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3"
            >
              {/* Author & Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <span>{post.authorName}</span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        · {post.authorRole}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
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
                  className="text-slate-400 hover:text-red-600 p-1 rounded"
                  title="Report post"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="text-base font-bold text-slate-900">{post.title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed mt-1 whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1">
                {post.tags.map((t, i) => (
                  <span key={i} className="text-[10px] text-slate-500 font-mono">
                    #{t}
                  </span>
                ))}
              </div>

              {/* Reactions & Comments bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => store.togglePostLike(post.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
                      post.userLiked
                        ? 'text-emerald-700 bg-emerald-50 font-semibold'
                        : 'hover:bg-slate-100'
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
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-2 pt-2">
                {post.comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{comm.authorName}</span>
                      <span className="text-[10px] text-slate-400 capitalize">
                        ({comm.authorRole})
                      </span>
                    </div>
                    <p className="text-slate-700">{comm.content}</p>
                  </div>
                ))}

                {activeCommentPostId === post.id && (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Add a constructive response..."
                      className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-sm text-slate-900">Post in Community Guild</h3>
                <button
                  onClick={() => setCreatePostModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="p-6 space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Discussion Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Completed my first match analysis: here's what surprised me"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Content & Reflections
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share your learning takeaway, challenge results, or ask a question..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    placeholder="Sports, Data, Beginner"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCreatePostModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
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
