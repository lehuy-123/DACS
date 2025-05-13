import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/PostTable.css';

const PostTable = () => {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem('user'))?.token;

  useEffect(() => {
    fetchPosts();
  }, [search, page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5001/api/posts?search=${search}&page=${page}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error('❌ Lỗi lấy danh sách bài viết:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-table-container">
      <h2 className="section-title">📄 Danh sách bài viết</h2>

      <input
        type="text"
        placeholder="🔍 Tìm theo tiêu đề hoặc tác giả..."
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        className="search-input"
      />

      {loading ? (
        <p className="loading-text">Đang tải bài viết...</p>
      ) : (
        <table className="post-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Trạng thái</th>
              <th>Lượt xem</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">Không tìm thấy bài viết nào.</td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post._id}>
                  <td>{post.title}</td>
                  <td>{post.author?.email || 'Ẩn danh'}</td>
                  <td>
                    <span className={`status ${post.status}`}>
                      {post.status === 'public' ? '🌐 Công khai' :
                       post.status === 'draft' ? '📝 Nháp' :
                       '🚫 Đã ẩn'}
                    </span>
                  </td>
                  <td>{post.views || 0}</td>
                  <td>{new Date(post.createdAt).toLocaleString()}</td>
                  <td>
                    {/* Các nút quản lý sẽ thêm sau */}
                    <button className="btn small edit">Chi tiết</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostTable;
