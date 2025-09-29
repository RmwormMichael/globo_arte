import "../App.css";
import logoTittle from "../assets/logo/globoTittle.png";
import logo from "../assets/logo/logo.png";

export default function Navbar({ onOpenLogin, onOpenRegister, user, onLogout }) {
  // Función para cerrar el navbar
  const closeNavbar = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  };

  // Función para cerrar el navbar y hacer scroll
  const handleNavClick = (sectionId) => {
    closeNavbar();
    
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 100);
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
                  onClick={() => handleNavClick('gallery')}
                >
                  Gallery
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleNavClick('about')}
                >
                  About
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleNavClick('services')}
                >
                  Services
                </button>
              </li>

              {/* Mostrar diferentes opciones según si está logueado o no */}
              {user ? (
                <>
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