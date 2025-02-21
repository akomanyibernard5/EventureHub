import React, { useState, useEffect , useContext} from 'react';
import { EventContext } from "../../contexts/EventContext.jsx";
import toast from 'react-hot-toast';

const EventCommentsModal = ({ isOpen, onClose, event }) => {
  const {url} = useContext(EventContext)
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && event) {
      fetchComments();
      console.log(event.photos)
    }
  }, [isOpen, event]);


  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${url}/api/events/${event._id}/comments`, {
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
      const response = await fetch(`${url}/api/events/${event._id}/comments`, {
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
      console.log(error)
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl shadow-xl border border-white/10">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Event Discussion</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[600px]">
          <div className="w-1/2 border-r border-white/10 p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Event Media</h3>
            <div className="grid grid-cols-2 gap-4">
              {event.photos?.map((photo, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden">
                  <img
                    src={`${url}/${photo}`}
                    alt={`Event photo ${index + 1}`}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Image+Not+Found";
                      console.error(`Failed to load image: ${photo}`);
                    }}
                  />
                </div>
              ))}
              {(event.videos ?? []).map((video, index) => {
                console.log("Video List:", event.videos); 

                return (
                  <div key={index} className="relative group rounded-lg overflow-hidden">
                    <video
                      src={`%{url}/${video}`}
                      alt={`Event video ${index + 1}`}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.parentNode.innerHTML = `<p class="text-center text-gray-500">Video Not Available</p>`;
                        console.error(`Failed to load video: ${video}`);
                      }}
                    />
                  </div>
                );
              })}



            </div>
          </div>


          <div className="w-1/2 p-6 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {comments.map((comment, index) => (
                <div key={index} className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <span className="text-primary-400 text-sm font-medium">
                        {comment.user.fullName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{comment.user.fullName}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 ml-11">{comment.content}</p>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-gray-800/50 border border-white/10 rounded-xl p-4 text-white 
                         placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                rows="3"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isLoading}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-xl 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCommentsModal; 