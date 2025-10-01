import React, { useState, useEffect } from 'react';
import { getCurrentUser, updateProfile } from '../services/authService';
import Swal from 'sweetalert2';
import "../assets/css/stylesUsers.css"

const ClientProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: '',
    email: ''
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setEditForm({
      nombre: currentUser.nombre,
      email: currentUser.email
    });
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Debes iniciar sesión nuevamente.'
      });
      return;
    }

    try {
      setLoading(true);
      await updateProfile(user.id, editForm, token);
      
      // Actualizar el usuario en localStorage y estado
      const updatedUser = { ...user, ...editForm };
      localStorage.setItem('usuario', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setShowEditModal(false);
      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado',
        text: 'Los cambios se guardaron correctamente.'
      });
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el perfil.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container fondo">
      <div className="card">
        <div className="card-body d-flex justify-content-between">
          <h3>Nombre Cliente:</h3>
          <h3>{user.nombre}</h3>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <strong>Email:</strong> {user.email}
          </li>
        </ul>
        <div className="card-body">
          <button 
            type="button" 
            className="btn btn-outline-primary"
            onClick={handleEditClick}
          >
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar perfil</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="clienteNombre" className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="clienteNombre"
                      name="nombre"
                      value={editForm.nombre}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="clienteEmail" className="form-label">Correo electrónico</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="clienteEmail"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSaveChanges}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;