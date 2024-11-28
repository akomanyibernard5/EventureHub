import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const EventCommentModal = ({ isOpen, onClose, event }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && event) {
      fetchComments();
    }
  }, [isOpen, event]);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/events/${event._id}/comments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/events/${event._id}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newComment })
      });

      const data = await response.json();
      if (data.success) {
        setComments([...comments, data.comment]);
        setNewComment('');
        toast.success('Comment added successfully');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl shadow-xl border border-white/10">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">Event Comments</h2>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {comments.map((comment, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-800/50 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center">
                  <span className="text-sky-400 text-sm">
                    {comment.user.fullName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{comment.user.fullName}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-300">{comment.content}</p>
            </div>
          ))}

          <div className="mt-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment..."
              className="w-full bg-gray-800/50 border border-white/10 rounded-xl p-4 text-white 
                       placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              rows="3"
            />
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isLoading}
                className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCommentModal; 