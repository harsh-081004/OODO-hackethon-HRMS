import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Edit2, Trash2, PlusCircle, CheckCircle, XCircle } from 'lucide-react';

export const AdminNotices = () => {
  const { notices, createNotice, updateNotice, deleteNotice, currentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    isActive: true
  });

  const handleOpenModal = (notice = null) => {
    if (notice) {
      setEditingNotice(notice);
      setFormData({
        title: notice.title,
        content: notice.content,
        isActive: notice.isActive
      });
    } else {
      setEditingNotice(null);
      setFormData({ title: '', content: '', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingNotice) {
      await updateNotice(editingNotice.id, formData);
    } else {
      await createNotice({ ...formData, author: currentUser.id });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice permanently?')) {
      await deleteNotice(id);
    }
  };

  const handleToggleStatus = async (notice) => {
    await updateNotice(notice.id, { isActive: !notice.isActive });
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Notice Board</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage company-wide announcements and notices.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary">
          <PlusCircle size={16} /> New Notice
        </button>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content Snippet</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notices.map(notice => (
              <tr key={notice.id}>
                <td style={{ fontWeight: 700 }}>{notice.title}</td>
                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {notice.content}
                </td>
                <td>{notice.author?.name || 'Admin'}</td>
                <td>
                  <button 
                    onClick={() => handleToggleStatus(notice)}
                    className={`badge ${notice.isActive ? 'badge-success' : 'badge-danger'}`}
                    style={{ border: 'none', cursor: 'pointer' }}
                    title="Click to toggle status"
                  >
                    {notice.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => handleOpenModal(notice)} className="btn-icon btn-secondary" style={{ marginRight: '0.5rem' }}>
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(notice.id)} className="btn-icon btn-danger">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No notices found. Create one to broadcast to employees.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="glass-card modal-content animate-fade-in" style={{ padding: '2rem', maxWidth: '500px', width: '100%' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              {editingNotice ? 'Edit Notice' : 'Create New Notice'}
            </h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Notice Title</label>
                <input 
                  type="text" 
                  className="input-field" 
                  required 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Townhall Meeting Friday"
                />
              </div>
              
              <div className="form-group">
                <label>Notice Content</label>
                <textarea 
                  className="input-field" 
                  required 
                  rows={5}
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  placeholder="Enter the details of the notice..."
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  id="isActive"
                  checked={formData.isActive}
                  onChange={e => setFormData({...formData, isActive: e.target.checked})}
                />
                <label htmlFor="isActive" style={{ margin: 0 }}>Publish immediately (Active)</label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingNotice ? 'Update Notice' : 'Publish Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
