import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import Editor from './Editor';
import Comments from './Comments';
import InviteModal from './InviteModal';

function Board() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const unsubscribe = onSnapshot(doc(db, 'boards', id), (doc) => {
      if (doc.exists()) {
        setBoard({ id: doc.id, ...doc.data() });
      } else {
        alert('Board not found!');
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [id, user, navigate]);

  const saveContent = async (content) => {
    try {
      await updateDoc(doc(db, 'boards', id), {
        content: content
      });
    } catch (err) {
      alert('Error saving: ' + err.message);
    }
  };

  if (!board) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>{board.title}</h2>
        <div>
          <button onClick={() => setShowInvite(true)} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', marginRight: '10px' }}>
            Share Board
          </button>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none' }}>
            Back
          </button>
        </div>
      </div>

      <Editor initialContent={board.content} onSave={saveContent} />
      <Comments boardId={id} />

      {showInvite && <InviteModal boardId={id} onClose={() => setShowInvite(false)} />}
    </div>
  );
}

export default Board;