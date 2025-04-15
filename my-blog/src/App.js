import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Login';
import UserBlogList from './pages/UserBlogList';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import BlogByTag from './pages/BlogByTag';
import BlogByCategory from './pages/BlogByCategory';
import UserProfile from './pages/UserProfile';
import EditUserProfile from './pages/EditUserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-blogs" element={<UserBlogList />} />
        <Route path="/create-blog" element={<CreateBlog />} />
        <Route path="/edit-blog/:id" element={<EditBlog />} />
        <Route path="/tag/:tag" element={<BlogByTag />} />
        <Route path="/category/:category" element={<BlogByCategory />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/edit-profile" element={<EditUserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;