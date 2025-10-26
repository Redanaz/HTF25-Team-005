import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useParams } from 'react-router-dom';
import Editor from './Editor';
import Comments from './Comments';

function Board() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [content, setContent] = useState('');

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  const loadBoard = async () => {
    const boardDoc = await getDoc(doc(db, 'boards', boardId));
    if (boardDoc.exists()) {
      const data = boardDoc.data();
      setBoard(data);
      setContent(data.content || '');
    }
  };

  const saveContent = async () => {
    await updateDoc(doc(db, 'boards', boardId), {
      content: content
    });
    alert('Saved!');
  };

  if (!board) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{board.title}</h1>
      <Editor value={content} onChange={setContent} />
      <button onClick={saveContent} style={{ marginTop: '10px', padding: '10px 20px' }}>
        Save Notes
      </button>
      <Comments boardId={boardId} />
    </div>
  );
}

export default Board;