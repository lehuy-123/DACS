import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserBlogList from './pages/UserBlogList';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogByTag from './pages/BlogByTag';
import BlogByCategory from './pages/BlogByCategory';

import EditUserProfile from './pages/EditUserProfile';
import BookmarkList from './pages/BookmarkList';
import AdminPostsPage from './pages/AdminPostsPage';
import AdminReviewPage from './pages/AdminReviewPage'; // ✅ thêm dòng này
import './styles/DarkMode.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-blogs" element={<UserBlogList />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
        <Route path="/tag/:tag" element={<BlogByTag />} />
        <Route path="/category/:category" element={<BlogByCategory />} />
      
        <Route path="/profile" element={<EditUserProfile />} />
        <Route path="/bookmarks" element={<BookmarkList />} />

        {/* ✅ Route admin: xem danh sách bài viết */}
        <Route
          path="/admin/posts"
          element={
            user && user.role === 'admin' ? <AdminPostsPage /> : <Navigate to="/" replace />
          }
        />

        {/* ✅ Route admin: duyệt bài viết */}
        <Route
          path="/admin/review"
          element={
            user && user.role === 'admin' ? <AdminReviewPage /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
