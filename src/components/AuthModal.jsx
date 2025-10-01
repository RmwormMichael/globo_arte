import { useState, useEffect } from "react";
import { loginUsuario, registrarUsuario, recuperarPassword, validarCorreo } from "../services/authService";

export default function AuthModal({ show, onClose, initialForm, onLoginSuccess }) {
  const [activeForm, setActiveForm] = useState(initialForm);
  const [formData, setFormData] = useState({
    loginEmail: "",
    loginPassword: "",
    inputName: "",
    emailRegister: "",
    registerPassword: "",
    resetEmail: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setActiveForm(initialForm);
    setError(""); // Limpiar errores al cambiar formulario
  }, [initialForm]);

  const modalTitle = {
    login: "Inicia sesión",
    register: "Crear cuenta",
    reset: "Recuperar contraseña",
  };

  const actionBtnText = {
    login: "Iniciar sesión",
    register: "Registrar",
    reset: "Recuperar contraseña",
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError(""); // Limpiar error al escribir
  };

const handleAction = async () => {
  setLoading(true);
  setError("");

  try {
    if (activeForm === "login") {
      // LOGIN
      const { loginEmail: email, loginPassword: password } = formData;
      
      if (!email || !password) {
        setError("Por favor, completa todos los campos");
        return;
      }

      console.log('Intentando login con:', { email, password });
      
      const data = await loginUsuario(email, password);
      
      console.log('Respuesta del login:', data);
      
      if (!data.token) {
        setError(data.message || "Error en el login");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      
      console.log('Token guardado, llamando onLoginSuccess...');
      onLoginSuccess(data.usuario);

    

      } else if (activeForm === "register") {
        // REGISTRO
        const { inputName: nombre, emailRegister: email, registerPassword: password } = formData;

        if (!nombre || !email || !password) {
          setError("Por favor, complete todos los campos.");
          return;
        }

        if (!validarCorreo(email)) {
          setError("Correo electrónico inválido.");
          return;
        }

        if (password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres.");
          return;
        }

        const data = await registrarUsuario(nombre, email, password);
        
        // Mostrar mensaje de éxito
        alert(data.msg || "¡Registro exitoso! Revisa tu email para confirmar tu cuenta.");
        
        // Cambiar a login después del registro exitoso
        setActiveForm("login");
        // Limpiar formulario de registro
        setFormData(prev => ({
          ...prev,
          inputName: "",
          emailRegister: "",
          registerPassword: ""
        }));

      } else if (activeForm === "reset") {
        // RECUPERACIÓN
        const { resetEmail: email } = formData;
        
        if (!email) {
          setError("Por favor, ingresa tu email.");
          return;
        }

        if (!validarCorreo(email)) {
          setError("Correo electrónico inválido.");
          return;
        }

        const data = await recuperarPassword(email);
        
        if (!data.ok) {
          setError(data.message);
          return;
        }
        
        alert("Te hemos enviado un correo con instrucciones para recuperar tu contraseña.");
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }}></div>

      <div
        className="modal fade show"
        style={{
          display: "block",
          zIndex: 1050,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflowX: "hidden",
          overflowY: "auto",
          outline: 0,
        }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalTitle">
                {modalTitle[activeForm]}
              </h1>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                disabled={loading}
              ></button>
            </div>

            <div className="modal-body">
              {/* Mostrar error */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <div style={{ display: activeForm === "login" ? "block" : "none" }}>
                <div className="mb-3">
                  <label htmlFor="loginEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="loginEmail"
                    placeholder="name@example.com"
                    value={formData.loginEmail}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="loginPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="loginPassword"
                    value={formData.loginPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    minLength="6"
                  />
                </div>
                <div className="mb-3">
                  <a
                    className="text-primary"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveForm("reset");
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div>

              {/* Register Form */}
              <div style={{ display: activeForm === "register" ? "block" : "none" }}>
                <div className="mb-3">
                  <label htmlFor="inputName" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="inputName"
                    placeholder="Nombre Completo"
                    value={formData.inputName}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="emailRegister" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailRegister"
                    placeholder="name@example.com"
                    value={formData.emailRegister}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="registerPassword" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="registerPassword"
                    value={formData.registerPassword}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                    minLength="4"
                    placeholder="Mínimo 4 caracteres"
                  />
                </div>
              </div>

              {/* Reset Password Form */}
              <div style={{ display: activeForm === "reset" ? "block" : "none" }}>
                <div className="mb-3">
                  <label htmlFor="resetEmail" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="resetEmail"
                    placeholder="name@example.com"
                    value={formData.resetEmail}
                    onChange={handleInputChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAction}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Cargando...
                  </>
                ) : (
                  actionBtnText[activeForm]
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}