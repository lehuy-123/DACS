import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SidebarAdmin from '../components/SidebarAdmin';
import '../styles/AdminTagsPage.css';

const AdminTagsPage = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState(null);
  const [search, setSearch] = useState('');
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const fetchTags = async () => {
    try {
      const res = await axios.get(`http://localhost:5001/api/tags?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTags(res.data.tags);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách tag:', err);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [search]);

  const handleAddTag = async () => {
    if (!newTag.trim()) return;
    try {
      await axios.post('http://localhost:5001/api/tags', { name: newTag }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewTag('');
      fetchTags();
    } catch (err) {
      console.error('Lỗi khi thêm tag:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Xoá tag này?');
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5001/api/tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTags();
    } catch (err) {
      console.error('Lỗi khi xoá tag:', err);
    }
  };

  const handleEdit = async () => {
    if (!editingTag.name.trim()) return;
    try {
      await axios.put(`http://localhost:5001/api/tags/${editingTag._id}`, { name: editingTag.name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingTag(null);
      fetchTags();
    } catch (err) {
      console.error('Lỗi khi sửa tag:', err);
    }
  };

  return (
    <div className="admin-container">
      <SidebarAdmin />
      <div className="admin-content">
        <h2>🏷️ Quản lý Tag</h2>

        <input
          type="text"
          placeholder="🔍 Tìm kiếm tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="add-tag">
          <input
            type="text"
            placeholder="Tên tag mới"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <button onClick={handleAddTag}>➕ Thêm</button>
        </div>

        <table className="tag-table">
          <thead>
            <tr>
              <th>Tên tag</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => (
              <tr key={tag._id}>
                <td>
                  {editingTag?._id === tag._id ? (
                    <input
                      value={editingTag.name}
                      onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                    />
                  ) : (
                    tag.name
                  )}
                </td>
                <td>
                  {editingTag?._id === tag._id ? (
                    <button onClick={handleEdit}>💾 Lưu</button>
                  ) : (
                    <button onClick={() => setEditingTag(tag)}>✏️ Sửa</button>
                  )}
                  <button onClick={() => handleDelete(tag._id)}>🗑️ Xoá</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTagsPage;
