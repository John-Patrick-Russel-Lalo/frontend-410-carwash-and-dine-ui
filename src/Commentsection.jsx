// CustomerComments.jsx
import { useState } from 'react';

const CustomerComments = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([
   
  ]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: comments.length + 1,
        name: "Anonymous User",
        comment: comment,
        date: new Date().toISOString().split('T')[0],
        rating: 4
      };
      setComments([newComment, ...comments]);
      setComment('');
    }
  };
  
  return (
    <section className="mt-12 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
      <h2 className="text-2xl font-bold mb-4">Customer Comments</h2>
      
      
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          placeholder="Write your comment here..."
          rows="4"
        ></textarea>
        
        <button 
          type="submit"
          className="w-full text-white py-3 px-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-lg"
        >
          Submit Comment
        </button>
      </form>
      
 
      <div>
        <h3 className="text-lg font-semibold mb-3">Recent Comments</h3>
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm mr-3">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-medium">{c.name}</p>
                    <span className="text-sm text-gray-500">{c.date}</span>
                  </div>
                  <div className="flex text-amber-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 fill-current ${i < c.rating ? '' : 'text-gray-300'}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{c.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerComments;