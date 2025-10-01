import "../App.css";
import logoTittle from "../assets/logo/globoTittle.png";
import logo from "../assets/logo/logo.png";
import { useNavigate } from "react-router-dom";
import { useUser } from '../hooks/useUser'; 

export default function Navbar({ onOpenLogin, onOpenRegister, onLogout }) {
  const navigate = useNavigate();
  const { user } = useUser(); // Obtén el usuario del contexto

  // Función para cerrar el navbar
  const closeNavbar = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  };

  // Función para manejar navegación a secciones de admin
  const handleAdminNavigation = (route) => {
    closeNavbar();
    navigate(route);
  };

  // Función para manejar Login
  const handleLogin = (e) => {
    e.preventDefault();
    closeNavbar();
    onOpenLogin();
  };

  // Función para manejar Register
  const handleRegister = (e) => {
    e.preventDefault();
    closeNavbar();
    onOpenRegister();
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          {/* Contenedor para logo y título */}
          <div className="d-flex align-items-center">
            <img src={logo} className="logo" alt="Logo" />
            <img src={logoTittle} className="globoTittle" alt="Globo Arte" />
          </div>
          
          {/* Botón toggler */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          {/* Menú colapsable */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => navigate('/')}
                >
                  Home
                </button>
              </li>

              {/* Mostrar diferentes opciones según si está logueado o no */}
              {user ? (
                <>
                  {/* Opciones de Admin - solo si el usuario es admin */}
                  {user.rol === 'admin' && (
                    <>
                      <li className="nav-item">
                        <button
                          className="nav-link btn btn-link"
                          onClick={() => handleAdminNavigation('/admin/orders')}
                        >
                          Orders
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="nav-link btn btn-link"
                          onClick={() => handleAdminNavigation('/admin/new-order')}
                        >
                          New Order
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="nav-link btn btn-link"
                          onClick={() => handleAdminNavigation('/admin/users')}
                        >
                          Users
                        </button>
                      </li>
                    </>
                  )}
                  
                  <li className="nav-item">
                    <span className="nav-link text-dark">
                      Hola, {user.nombre}
                    </span>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={onLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={handleLogin}
                    >
                      Login
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link"
                      onClick={handleRegister}
                    >
                      Register
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}