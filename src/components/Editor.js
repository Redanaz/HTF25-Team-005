import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Editor({ initialContent, onSave }) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    onSave(content);
    alert('Saved!');
  };

  return (
    <div style={{ marginBottom: '30px' }}>
      <ReactQuill 
        value={content} 
        onChange={setContent}
        style={{ height: '300px', marginBottom: '50px' }}
      />
      <button onClick={handleSave} style={{ padding: '10px 30px', background: '#28a745', color: 'white', border: 'none', marginTop: '10px' }}>
        Save Notes
      </button>
    </div>
  );
}

export default Editor;