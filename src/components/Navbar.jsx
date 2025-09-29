import "../App.css";
import logoTittle from "../assets/logo/globoTittle.png";
import logo from "../assets/logo/logo.png";

export default function Navbar({ onOpenLogin, onOpenRegister, user, onLogout }) {
  // Función para cerrar el navbar
  const closeNavbar = () => {
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse.classList.contains('show')) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  };

  // Función para cerrar el navbar y hacer scroll
  const handleNavClick = (sectionId) => {
    closeNavbar(); // Cerrar navbar primero
    
    // Scroll manual a la sección
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -80; // Ajuste para el navbar
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
    closeNavbar(); // Cerrar navbar
    onOpenLogin(); // Abrir modal
  };

  // Función para manejar Register
  const handleRegister = (e) => {
    e.preventDefault();
    closeNavbar(); // Cerrar navbar
    onOpenRegister(); // Abrir modal
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <img src={logo} className="logo" alt="Logo" />
          <img src={logoTittle} className="globoTittle" alt="Globo Arte" />
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
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleNavClick('gallery')}
                  style={{ border: "none", background: "transparent" }}
                >
                  Gallery
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleNavClick('about')}
                  style={{ border: "none", background: "transparent" }}
                >
                  About
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => handleNavClick('services')}
                  style={{ border: "none", background: "transparent" }}
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
                      className="nav-link btn btn-link navLogin"
                      onClick={onLogout}
                      style={{ border: "none", background: "transparent" }}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link navLogin"
                      onClick={handleLogin}
                      style={{ border: "none", background: "transparent" }}
                    >
                      Login
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link btn btn-link navLogin"
                      onClick={handleRegister}
                      style={{ border: "none", background: "transparent" }}
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