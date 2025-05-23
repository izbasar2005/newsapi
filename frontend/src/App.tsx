
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewsList from "./pages/NewsList";
import Profile from "./pages/Profile";
import NewsDetail from "./pages/NewsDetail.tsx";
import EditNews from "./pages/EditNews.tsx";
import AddNews from "./pages/AddNews.tsx";
import AdminCategoryPage from "./pages/AdminCategoryPage.tsx";

const App = () => (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/admin/news/:id" element={<NewsDetail />} />
            <Route path="/admin/news/edit/:id" element={<EditNews />} />
        <Route path="/add-news" element={<AddNews />} />
        <Route path="/admin/categories" element={<AdminCategoryPage />} />
    </Routes>
);

export default App;
