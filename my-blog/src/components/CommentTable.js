import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/CommentTable.css';

const CommentTable = () => {
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/comments');
      setComments(res.data.data);
    } catch (err) {
      console.error('Lỗi khi lấy bình luận:', err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Xác nhận xoá bình luận này?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5001/api/comments/${id}`);
      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Lỗi khi xoá bình luận:', err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="comment-table">
      <h2>💬 Danh sách bình luận</h2>
      <table>
        <thead>
          <tr>
            <th>Nội dung</th>
            <th>Người gửi</th>
            <th>Bài viết</th>
            <th>Ngày</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {comments.length === 0 ? (
            <tr>
              <td colSpan="5">Không có bình luận nào.</td>
            </tr>
          ) : (
            comments.map((cmt) => (
              <tr key={cmt._id}>
                <td>{cmt.content}</td>
                <td>{cmt.author?.name || 'Ẩn danh'}</td>
                <td>{cmt.blog?.title || 'Không rõ'}</td>
                <td>{new Date(cmt.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>
                  <button onClick={() => handleDelete(cmt._id)} className="danger">🗑️ Xoá</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CommentTable;
