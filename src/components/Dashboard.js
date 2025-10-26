import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const navigate = useNavigate();
  const userEmail = auth.currentUser?.email;

  useEffect(() => {
    loadBoards();
  }, []);

  const loadBoards = async () => {
    const q = query(
      collection(db, 'boards'),
      where('members', 'array-contains', userEmail)
    );
    const snapshot = await getDocs(q);
    const boardsData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setBoards(boardsData);
  };

  const createBoard = async () => {
    if (!newBoardTitle.trim()) return;
    
    const boardRef = await addDoc(collection(db, 'boards'), {
      title: newBoardTitle,
      owner: userEmail,
      members: [userEmail],
      content: '',
      createdAt: serverTimestamp()
    });
    
    setNewBoardTitle('');
    navigate(`/board/${boardRef.id}`);
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Study Boards</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>
      
      <div style={{ marginTop: '20px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="New board title"
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          style={{ padding: '10px', marginRight: '10px', width: '300px' }}
        />
        <button onClick={createBoard} style={{ padding: '10px' }}>
          Create New Board
        </button>
      </div>

      <div>
        {boards.map(board => (
          <div
            key={board.id}
            onClick={() => navigate(`/board/${board.id}`)}
            style={{
              padding: '15px',
              margin: '10px 0',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            <h3>{board.title}</h3>
            <small>Members: {board.members?.length || 0}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;