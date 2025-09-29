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

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getCurrentUser());
    }
  }, []);

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

  // CORREGIDO: Usar estado en lugar de redirección forzada
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowAuthModal(false);
    // No redirigir - el componente se re-renderizará automáticamente
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUser(null);
    // No redirigir - el componente se re-renderizará automáticamente
  };

  return (
    <BrowserRouter>
      <Navbar
        onOpenLogin={handleOpenLogin}
        onOpenRegister={handleOpenRegister}
        user={user}
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
              {/* Mostrar ClientDashboard si el usuario está logueado */}
              {user && user.rol === 'cliente' && (
                <ClientDashboard user={user} />
              )}
              {user && user.rol === 'admin' && (
                <AdminDashboard user={user} />
              )}
              
              {/* Contenido normal para todos los usuarios */}
              <SeccionUno />

              <Services />
              <About />
              <TemplatesGallery />
            </div>
          }
        />
        
        {/* Rutas separadas si aún las necesitas */}
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

export default App;