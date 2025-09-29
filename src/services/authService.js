const API_URL = "http://localhost:4000/api/usuarios/";

export const loginUsuario = async (email, password) => {
  try {
    const response = await fetch(API_URL + "login", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
      },
      credentials: 'include', // ← Para cookies si las usas
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en el login');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en loginUsuario:', error);
    throw error;
  }
};

export const registrarUsuario = async (nombre, email, password) => {
  try {
    const usuarioData = { nombre, email, password };
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || 'Error en el registro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    throw error;
  }
};

export const recuperarPassword = async (email) => {
  try {
    const response = await fetch(API_URL + "olvide-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        ok: false,
        message: data.msg || "Error al solicitar recuperación"
      };
    }
    
    return {
      ok: true,
      message: data.msg
    };
    
  } catch (error) {
    console.error("Error:", error);
    return {
      ok: false,
      message: "Error de conexión"
    };
  }
};

export const validarCorreo = (correo) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(correo);
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Obtener datos del usuario
export const getCurrentUser = () => {
  const user = localStorage.getItem('usuario');
  return user ? JSON.parse(user) : null;
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
};