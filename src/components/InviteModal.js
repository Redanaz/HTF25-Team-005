import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

function InviteModal({ boardId, onClose }) {
  const inviteLink = `${window.location.origin}/join/${boardId}`;
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '500px'
      }}>
        <h3>Share This Board</h3>
        <p>Copy this link to invite others:</p>
        <input
          type="text"
          value={inviteLink}
          readOnly
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button onClick={copyLink} style={{ marginRight: '10px' }}>
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default InviteModal;