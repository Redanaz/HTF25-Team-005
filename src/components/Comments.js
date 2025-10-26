import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';

function Comments({ boardId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(
      collection(db, 'comments'),
      where('boardId', '==', boardId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [boardId]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addDoc(collection(db, 'comments'), {
        boardId: boardId,
        text: newComment,
        author: user.email,
        createdAt: new Date()
      });
      setNewComment('');
    } catch (err) {
      alert('Error adding comment: ' + err.message);
    }
  };

  return (
    <div style={{ marginTop: '40px', padding: '20px', border: '1px solid #ddd' }}>
      <h3>Comments</h3>
      
      <form onSubmit={addComment} style={{ margin: '20px 0' }}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          style={{ width: '100%', padding: '10px', minHeight: '80px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', marginTop: '10px' }}>
          Add Comment
        </button>
      </form>

      <div>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} style={{ padding: '10px', margin: '10px 0', background: '#f8f9fa', borderLeft: '3px solid #007bff' }}>
              <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px' }}>{comment.author}</p>
              <p style={{ margin: '5px 0' }}>{comment.text}</p>
              <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                {comment.createdAt?.toDate().toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Comments;