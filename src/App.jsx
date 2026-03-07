import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/Authpages";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import AiFrame from "./pages/Aiframe";
import VisionHealthDashboard from "./pages/VisionHealthDashboard";
import AppointmentPage from "./pages/AppointmentPage";
import SupportPage from "./pages/SupportPage";
import AdminPage from "./pages/Admin";
import ProfilePage from "./pages/ProfilePage";
import LayoutWithNavbar from "./pages/LayoutWithNavbar"; // Your main layout component
import ProtectedRoute from "./pages/ProtectedRoute";
import { useAuth } from "./pages/AuthContext";
import CartPage from "./pages/CartPage";
import "./App.css";

export default function App() {
  // Get the loading state from the context AT THE TOP LEVEL.
  const { loading } = useAuth();

  // If the context is still performing its initial check, show a full-page loading screen.
  // This prevents the router and all components from rendering prematurely. THIS IS THE FIX.
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#111827'
      }}>
        <p style={{ color: 'white', fontSize: '1.2rem' }}>Loading VisionCart...</p>
      </div>
    );
  }

  // Once loading is false, it's safe to render the router.
  return (
    <Router>
      <Routes>
        {/* Routes WITHOUT Navbar */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Routes WITH Navbar */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/shop" element={<Shop />} />
            <Route path="/ai-frames" element={<AiFrame />} />
            <Route path="/vision-health" element={<VisionHealthDashboard />} />
            <Route path="/appointments" element={<AppointmentPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
