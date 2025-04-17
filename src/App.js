import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import CodeEditor from "./pages/CodeEditor";
import Exercise from "./pages/Exercise";
import ExerciseDetail from "./pages/ExerciseDetail";
import Community from "./pages/Community";
import Post from "./pages/Post";
import EditPost from "./pages/EditPost";
import Document from "./pages/Document";
import DocumentDetail from "./pages/DocumentDetail";
import Quiz from "./pages/Quiz";

import Dashboard from "./pages/Admin/Dashboard";
import AdminAccounts from "./pages/Admin/AdminAccounts";
import AdminEditUser from "./pages/Admin/AdminEditUser";
import AdminDocuments from "./pages/Admin/AdminDocuments";
import AdminEditDocument from "./pages/Admin/AdminEditDocument";
import AdminCreateDocument from "./pages/Admin/AdminCreateDocument";
import AdminPosts from "./pages/Admin/AdminPosts";
import AdminDetailPost from "./pages/Admin/AdminDetailPost";
import AdminExercises from "./pages/Admin/AdminExercises";
import AdminEditExercise from "./pages/Admin/AdminEditExercise";
import AdminCreateExercise from "./pages/Admin/AdminCreateExercise";
import AdminQuestion from "./pages/Admin/AdminQuestion";
import AdminEditQuestion from "./pages/Admin/AdminEditQuestion";

import "./App.css";
import "./styles/base.css";
import "./styles/header.css";
import "./styles/footer.css";
import "./styles/home.css";

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const hideHeaderFooter =
    ["/login", "/register"].includes(location.pathname) ||
    location.pathname.startsWith("/admin");

  // ✅ Move ProtectedRoute inside AppContent
  function ProtectedRoute() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) throw new Error("No token found");

          const response = await axios.get("http://localhost:8000/user/profile/", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.data.user.is_superuser) {
            setUser(response.data.user);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("accessToken");
          navigate("/login", { replace: true });
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }, []);

    if (loading) return <div>Loading...</div>;

    return user ? <Outlet /> : <Navigate to="/login" replace />;
  }

  return (
    <div className="App">
      {!hideHeaderFooter && <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/code-editor" element={<CodeEditor />} />
        <Route path="/exercise" element={<Exercise />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/post/:id" element={<Post />} />
        <Route path="/post/edit/:id" element={<EditPost />} />
        <Route path="/document" element={<Document />} />
        <Route path="/document/:slug" element={<DocumentDetail />} />
        <Route path="/quiz/:slug" element={<Quiz />} />

        {/* Admin Protected Routes */}
        <Route path="/admin/*" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<AdminAccounts />} />
          <Route path="edit-user/:id" element={<AdminEditUser />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="document/create" element={<AdminCreateDocument />} />
          <Route path="document/edit/:id" element={<AdminEditDocument />} />
          <Route path="posts" element={<AdminPosts />} />
          <Route path="post/:id" element={<AdminDetailPost />} />
          <Route path="exercises" element={<AdminExercises />} />
          <Route path="exercise/create" element={<AdminCreateExercise />} />
          <Route path="exercise/edit/:id" element={<AdminEditExercise />} />
          <Route path="questions" element={<AdminQuestion />} />
          <Route path="question/:id" element={<AdminEditQuestion />} />
        </Route>
      </Routes>

      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
      <AppContent />
  );
}

export default App;
