import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const q = query(collection(db, 'boards'), where('members', 'array-contains', user.email));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const boardsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBoards(boardsData);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const createBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;

    try {
      const docRef = await addDoc(collection(db, 'boards'), {
        title: newBoardTitle,
        owner: user.email,
        members: [user.email],
        content: '',
        createdAt: new Date()
      });
      setNewBoardTitle('');
      navigate(`/board/${docRef.id}`);
    } catch (err) {
      alert('Error creating board: ' + err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Study Boards</h2>
        <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none' }}>
          Logout
        </button>
      </div>

      <form onSubmit={createBoard} style={{ margin: '20px 0' }}>
        <input
          type="text"
          placeholder="New board title..."
          value={newBoardTitle}
          onChange={(e) => setNewBoardTitle(e.target.value)}
          style={{ width: '70%', padding: '10px' }}
        />
        <button type="submit" style={{ width: '28%', padding: '10px', background: '#28a745', color: 'white', border: 'none', marginLeft: '2%' }}>
          Create Board
        </button>
      </form>

      <div>
        {boards.length === 0 ? (
          <p>No boards yet. Create one!</p>
        ) : (
          boards.map(board => (
            <div key={board.id} onClick={() => navigate(`/board/${board.id}`)} style={{ padding: '15px', margin: '10px 0', border: '1px solid #ddd', cursor: 'pointer' }}>
              <h3>{board.title}</h3>
              <p style={{ fontSize: '12px', color: '#666' }}>Created by: {board.owner}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;