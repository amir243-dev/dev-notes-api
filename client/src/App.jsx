import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Capture from "./pages/Capture";
import Projects from "./pages/Projects";
import Stats from "./pages/Stats";
import Layout from "./components/Layout";
import ProjectView from "./pages/ProjectView";
import NoteDetail from "./pages/NoteDetail";
import Profile from "./pages/Profile";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  // FIX 1: Added 'return'
  if (loading)
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>Loading...</div>
    );
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          fontFamily: "monospace",
        }}
      >
        Connecting to backend...
      </div>
    );

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Capture />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectView />} />
        <Route path="/notes/:noteId" element={<NoteDetail />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  // FIX 2: Added 'return' to the main App component
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
