import { useState } from 'react';
import type { Comment } from '../types/Recipe';
import { addComment, deleteComment } from '../services/api';

interface CommentSectionProps {
  recipeId: number;
  comments: Comment[];
  onCommentAdded: () => void;
}

export const CommentSection = ({ recipeId, comments, onCommentAdded }: CommentSectionProps) => {
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    try {
      setSubmitting(true);
      await addComment(recipeId, author, text);
      setAuthor('');
      setText('');
      onCommentAdded();
    } catch (err) {
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await deleteComment(recipeId, commentId);
      onCommentAdded();
    } catch (err) {
      alert('Failed to delete comment');
    }
  };

  return (
    <div style={{ marginTop: '3rem' }}>
      <h3 style={{ borderBottom: '2px solid #F8E1E7', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
        Comments ({comments?.length || 0})
      </h3>

      <div style={{ marginBottom: '2rem' }}>
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="card" style={{ marginBottom: '1rem', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: 'var(--color-warm-brown)', marginBottom: '0.25rem' }}>
                    {comment.author}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '0.5rem' }}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                  <p style={{ margin: 0 }}>{comment.text}</p>
                </div>
                <button 
                  onClick={() => handleDelete(comment.id)} 
                  className="btn btn-danger" 
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No comments yet. Be the first to comment!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ padding: '1.5rem' }}>
        <h4 style={{ marginTop: 0 }}>Add a Comment</h4>
        <div className="input-group">
          <label>Your Name</label>
          <input 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            placeholder="Enter your name"
            required 
          />
        </div>
        <div className="input-group">
          <label>Comment</label>
          <textarea 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            rows={3}
            placeholder="Share your thoughts..."
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
};
