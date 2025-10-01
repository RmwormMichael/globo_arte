import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import AuthModal from "./components/AuthModal";
import SeccionUno from "./pages/SeccionUno";
import SectionGallery from "./pages/SectionGallery";
import Services from "./pages/Services";
import About from "./pages/About";
import TemplatesGallery from "./pages/TemplateGallery";
import Footer from "./components/Footer";
import ScrollToTop from './components/ScrollToTop';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import { getCurrentUser, isAuthenticated } from "./services/authService";
import EmailConfirmed from "./pages/EmailConfirmed";
import AdminUsers from './components/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider} from './context/UserProvider';
import { useUser} from './hooks/useUser';


function AppContent() {
  const { user, setUser } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalType, setModalType] = useState("login");

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    }
  }, [setUser]);

  const handleOpenLogin = () => {
    setModalType("login");
    setShowAuthModal(true);
  };

  const handleOpenRegister = () => {
    setModalType("register");
    setShowAuthModal(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        onLogout={handleLogout}
      />
      <AuthModal
        show={showAuthModal}
        onClose={handleCloseModal}
        initialForm={modalType}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <Routes>
        <Route
          path="/"
          element={
            <div>
              {user && user.rol === 'cliente' && (
                <ClientDashboard user={user} />
              )}
              {user && user.rol === 'admin' && (
                <AdminDashboard user={user} />
              )}
              
              <SeccionUno />
              <SectionGallery />
              <Services />
              <About />
              <TemplatesGallery />
            </div>
          }
        />

        {/* Rutas de administración */}
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <div>Página de Orders - Próximamente</div>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/new-order" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <div>Página de New Order - Próximamente</div>
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas separadas */}
        <Route 
          path="/cliente" 
          element={
            user && user.rol === 'cliente' ? 
            <ClientDashboard user={user} /> : 
            <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/admin" 
          element={
            user && user.rol === 'admin' ? 
            <AdminDashboard user={user} /> : 
            <Navigate to="/" replace />
          } 
        />
        <Route path="/confirmado" element={<EmailConfirmed />} />
      </Routes>
      
      <Footer/>
      <ScrollToTop />
    </BrowserRouter>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;