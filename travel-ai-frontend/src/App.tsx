import "./App.css";

import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuthStore } from "./store/auth.store";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Itineraries from "./pages/Itineraries";
import Share from "./pages/Share";
import ItineraryDetail from "./pages/ItineraryDetail";

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route
            index
            element={token ? <Navigate to="/dashboard" replace /> : <Login />}
          />

          <Route
            path="register"
            element={token ? <Navigate to="/dashboard" replace /> : <Register />}
          />

          <Route path="share/:shareId" element={<Share />} />

          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="upload" element={<Upload />} />
            <Route path="itineraries" element={<Itineraries />} />
            <Route path="itineraries/:id" element={<ItineraryDetail />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
