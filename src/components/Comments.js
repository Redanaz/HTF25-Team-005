import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

function Comments({ boardId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadComments();
  }, [boardId]);

  const loadComments = async () => {
    const q = query(
      collection(db, 'comments'),
      where('boardId', '==', boardId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const commentsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setComments(commentsData);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    
    await addDoc(collection(db, 'comments'), {
      boardId: boardId,
      text: newComment,
      author: auth.currentUser.email,
      createdAt: serverTimestamp()
    });
    
    setNewComment('');
    loadComments();
  };

  return (
    <div style={{ marginTop: '40px', borderTop: '2px solid #ddd', paddingTop: '20px' }}>
      <h3>Comments</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          style={{ width: '100%', padding: '10px', minHeight: '80px' }}
        />
        <button onClick={addComment} style={{ marginTop: '10px', padding: '8px 16px' }}>
          Post Comment
        </button>
      </div>

      <div>
        {comments.map(comment => (
          <div key={comment.id} style={{ 
            padding: '10px', 
            margin: '10px 0', 
            backgroundColor: '#f5f5f5',
            borderRadius: '5px'
          }}>
            <strong>{comment.author}</strong>
            <p>{comment.text}</p>
            <small>{comment.createdAt?.toDate().toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;