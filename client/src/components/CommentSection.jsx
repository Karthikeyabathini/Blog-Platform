import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Send, Reply, Edit2, Trash2, X, CornerDownRight } from 'lucide-react';

const CommentSection = ({ blogId }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommentText, setNewCommentText] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  // Replying state
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      const res = await api.get(`/comments/${blogId}`);
      if (res.data.success) {
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  }, [blogId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handlePostComment = async (e, parentComment = null) => {
    e.preventDefault();
    if (!user) {
      showToast('Please login to post comments!', 'error');
      return;
    }

    const text = parentComment ? replyText : newCommentText;
    if (!text.trim()) return;

    try {
      const res = await api.post(`/comments/${blogId}`, {
        comment: text,
        parentComment,
      });

      if (res.data.success) {
        showToast(parentComment ? 'Reply posted!' : 'Comment posted!', 'success');
        if (parentComment) {
          setReplyText('');
          setReplyingId(null);
        } else {
          setNewCommentText('');
        }
        fetchComments();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to post comment', 'error');
    }
  };

  const handleUpdateComment = async (e, commentId) => {
    e.preventDefault();
    if (!editText.trim()) return;

    try {
      const res = await api.put(`/comments/${commentId}`, { comment: editText });
      if (res.data.success) {
        showToast('Comment updated!', 'success');
        setEditingId(null);
        setEditText('');
        fetchComments();
      }
    } catch (err) {
      showToast('Failed to update comment', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await api.delete(`/comments/${commentId}`);
      if (res.data.success) {
        showToast('Comment removed!', 'success');
        fetchComments();
      }
    } catch (err) {
      showToast('Failed to delete comment', 'error');
    }
  };

  // Group comments into root level and replies
  const rootComments = comments.filter((c) => !c.parentComment);
  const getReplies = (commentId) => {
    return comments.filter((c) => c.parentComment === commentId);
  };

  const renderCommentCard = (comment, isReply = false) => {
    const isOwner = user && comment.userId?._id === user.id;
    const canDelete = user && (isOwner || user.role === 'admin');
    const isEditing = editingId === comment._id;
    const isReplying = replyingId === comment._id;

    const formattedTime = new Date(comment.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div
        key={comment._id}
        className={`p-4 rounded-2xl transition-all ${
          isReply
            ? 'bg-gray-50/50 dark:bg-gray-800/20 border border-gray-100 dark:border-gray-800/30'
            : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/50 shadow-sm'
        }`}
      >
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <img
            src={comment.userId?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comment.userId?.name || 'User')}`}
            alt={comment.userId?.name || 'Deleted User'}
            className="w-8.5 h-8.5 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />

          <div className="flex-grow min-w-0">
            {/* Header info */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {comment.userId?.name || 'Deleted User'}
              </span>
              {comment.userId?.role === 'admin' && (
                <span className="text-[10px] bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 font-bold px-1.5 py-0.25 rounded">
                  Admin
                </span>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {formattedTime}
              </span>
            </div>

            {/* Comment Text / Edit form */}
            {isEditing ? (
              <form onSubmit={(e) => handleUpdateComment(e, comment._id)} className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-grow text-sm px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-xl focus:border-primary-500 focus:outline-none dark:text-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-xl"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 p-2 rounded-xl"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                {comment.comment}
              </p>
            )}

            {/* Comment actions row */}
            {!isEditing && (
              <div className="mt-2 flex items-center gap-4 text-xs font-semibold text-gray-400 dark:text-gray-500">
                {user && !isReply && (
                  <button
                    onClick={() => {
                      setReplyingId(isReplying ? null : comment._id);
                      setReplyText('');
                    }}
                    className="flex items-center gap-1 hover:text-primary-500 transition-colors"
                  >
                    <Reply size={12} />
                    Reply
                  </button>
                )}

                {isOwner && (
                  <button
                    onClick={() => {
                      setEditingId(comment._id);
                      setEditText(comment.comment);
                    }}
                    className="flex items-center gap-1 hover:text-indigo-500 transition-colors"
                  >
                    <Edit2 size={12} />
                    Edit
                  </button>
                )}

                {canDelete && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="flex items-center gap-1 hover:text-red-500 text-red-400/80 transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                )}
              </div>
            )}

            {/* Reply Input Form */}
            {isReplying && (
              <form onSubmit={(e) => handlePostComment(e, comment._id)} className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder={`Reply to ${comment.userId?.name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-grow text-sm px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none dark:text-white"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  <Send size={12} />
                  Send
                </button>
                <button
                  type="button"
                  onClick={() => setReplyingId(null)}
                  className="text-gray-400 hover:text-gray-600 p-1.5"
                >
                  <X size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        Comments ({comments.length})
      </h3>

      {/* Main Comment input */}
      {user ? (
        <form onSubmit={(e) => handlePostComment(e, null)} className="space-y-3">
          <div className="relative">
            <textarea
              rows="3"
              placeholder="Join the discussion. Share your thoughts..."
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none text-sm dark:text-white shadow-sm resize-none"
              required
            ></textarea>
            <div className="absolute bottom-3 right-3">
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-primary-500/10"
              >
                <Send size={14} />
                Post Comment
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            You must be signed in to post comments.
          </p>
          <a
            href="/login"
            className="inline-flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-primary-500/10"
          >
            Sign In to Comment
          </a>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="py-4 text-center text-gray-400">Loading comments...</div>
      ) : rootComments.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-center py-6 text-sm">
          No comments yet. Be the first to start the conversation!
        </p>
      ) : (
        <div className="space-y-4">
          {rootComments.map((comment) => {
            const replies = getReplies(comment._id);

            return (
              <div key={comment._id} className="space-y-3">
                {/* Root Comment */}
                {renderCommentCard(comment, false)}

                {/* Replies nested under root */}
                {replies.length > 0 && (
                  <div className="pl-6 md:pl-10 space-y-3 relative">
                    {/* Visual linking line for replies */}
                    <div className="absolute left-3 md:left-5 top-0 bottom-4 w-[1px] bg-gray-200 dark:bg-gray-800"></div>

                    {replies.map((reply) => (
                      <div key={reply._id} className="relative">
                        {/* Nested replies icon arrow */}
                        <div className="absolute -left-3 md:-left-5 top-4 flex items-center">
                          <CornerDownRight size={14} className="text-gray-300 dark:text-gray-700" />
                        </div>
                        {renderCommentCard(reply, true)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
