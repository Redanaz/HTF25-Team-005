import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

function InviteModal({ boardId, onClose }) {
  const [email, setEmail] = useState('');
  const inviteLink = `${window.location.origin}/board/${boardId}`;

  const addMember = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const boardRef = doc(db, 'boards', boardId);
      await updateDoc(boardRef, {
        members: arrayUnion(email)
      });
      alert(`Invited ${email} to the board!`);
      setEmail('');
    } catch (err) {
      alert('Error inviting member: ' + err.message);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '8px', maxWidth: '500px', width: '100%' }}>
        <h3>Share Board</h3>
        
        <div style={{ margin: '20px 0' }}>
          <p>Invite Link:</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={inviteLink} 
              readOnly 
              style={{ flex: 1, padding: '10px', border: '1px solid #ddd' }}
            />
            <button onClick={copyLink} style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none' }}>
              Copy
            </button>
          </div>
        </div>

        <form onSubmit={addMember}>
          <p>Or invite by email:</p>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
          />
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none' }}>
            Invite
          </button>
        </form>

        <button onClick={onClose} style={{ width: '100%', padding: '10px', background: '#6c757d', color: 'white', border: 'none', marginTop: '20px' }}>
          Close
        </button>
      </div>
    </div>
  );
}

export default InviteModal;