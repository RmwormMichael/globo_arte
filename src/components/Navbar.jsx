import "../App.css";
import logoTittle from "../assets/logo/globoTittle.png";
import logo from "../assets/logo/logo.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useEffect, useRef } from "react";

export default function Navbar({ onOpenLogin, onOpenRegister, onLogout }) {
  const navigate = useNavigate();
  const { user } = useUser();
  const navbarRef = useRef(null);

  // Función para cerrar el navbar
  const closeNavbar = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  };

  // Cerrar navbar cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el navbar está abierto y el clic fue fuera del navbar
      const navbarCollapse = document.getElementById("navbarNav");
      if (navbarCollapse && navbarCollapse.classList.contains("show")) {
        if (navbarRef.current && !navbarRef.current.contains(event.target)) {
          closeNavbar();
        }
      }
    };

    // Agregar event listener cuando el componente se monta
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpiar event listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Función para manejar el clic en el botón toggler
  const handleToggleClick = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      // Si ya está abierto, cerrarlo
      closeNavbar();
    }
    // Si está cerrado, Bootstrap lo abrirá automáticamente
  };

  // Función para manejar navegación a secciones de admin
  const handleAdminNavigation = (route) => {
    closeNavbar();
    navigate(route);
  };

  // Función para manejar navegación del cliente
  const handleClientNavigation = (route) => {
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

  // Función genérica para navegar a secciones
  const navigateToSection = (sectionId) => {
    closeNavbar();
    navigate("/");
    // Pequeño delay para asegurar que la navegación se complete
    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // Función para navegar al inicio (top de la página)
  const handleHomeNavigation = () => {
    closeNavbar();
    navigate("/");
    // Scroll al top de la página
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={navbarRef}>
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
            onClick={handleToggleClick}
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
              {/* Mostrar botón Inicio solo cuando el usuario está logueado */}
              {user && (
                <li className="nav-item">
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleHomeNavigation}
                  >
                    Inicio
                  </button>
                </li>
              )}

              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => navigateToSection("sectGallery")}
                >
                  Galería
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => navigateToSection("services")}
                >
                  Servicios
                </button>
              </li>

              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => navigateToSection("about")}
                >
                  Nosotros
                </button>
              </li>

              {/* Mostrar diferentes opciones según si está logueado o no */}
              {user ? (
                <>
                  {/* Opciones de Cliente */}
                  {user.rol === "cliente" && (
                    <>
                      <li className="nav-item">
                        <button
                          className="nav-link btn btn-link"
                          onClick={() =>
                            handleClientNavigation("/cliente/my-orders")
                          }
                        >
                          Mis Órdenes
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="nav-link btn btn-link"
                          onClick={() =>
                            handleClientNavigation("/cliente/new-order")
                          }
                        >
                          Nueva Orden
                        </button>
                      </li>
                    </>
                  )}

                  {/* Opciones de Admin - solo si el usuario es admin */}
                  {user.rol === "admin" && (
                    <>
                      <li className="nav-item">
                        <button
                          className="nav-link btn btn-link"
                          onClick={() => handleAdminNavigation("/admin/orders")}
                        >
                          Orders
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="nav-link btn btn-link"
                          onClick={() =>
                            handleAdminNavigation("/admin/new-order")
                          }
                        >
                          New Order
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className="nav-link btn btn-link"
                          onClick={() => handleAdminNavigation("/admin/users")}
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