import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import { GuestRoute } from "./components/GuestRoute";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

    {/* Protected application */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/ai-dashboard" element={<Dashboard />} />
          <Route path="/my-tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Default route */}
        <Route path="/" element={<Login />} />

        {/* 404 */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;