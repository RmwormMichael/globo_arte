import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import "../assets/css/stylesUsers.css"

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    nombre: '',
    email: '',
    rol: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  // Cargar usuarios desde la API
  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:4000/api/usuarios/usuarios", {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }
      
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
      Swal.fire({
        title: "Error",
        text: "Error al cargar los usuarios",
        icon: "error"
      });
    }
  };

  // Manejar búsqueda de usuarios
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const texto = searchTerm.toLowerCase().trim();
    const filtrados = users.filter(usuario => {
      if (usuario.id_user.toString() === texto) return true;
      if (usuario.nombre.toLowerCase().includes(texto)) return true;
      if (usuario.email.toLowerCase().includes(texto)) return true;
      return false;
    });

    setFilteredUsers(filtrados);
  };

  // Abrir modal de edición
  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setEditForm({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol || 'user'
    });
  };

  // Guardar cambios del usuario
  const handleSave = async () => {
    if (!editingUser) return;

    const { nombre, email, rol } = editForm;
    
    if (!nombre || !email || !rol) {
      Swal.fire({
        title: "Campos incompletos",
        text: "Por favor, complete todos los campos.",
        icon: "warning"
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:4000/api/usuarios/usuarios/${editingUser.id_user}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, email, rol }),
      });

      if (response.ok) {
        Swal.fire({
          title: "¡Actualizado!",
          text: "Usuario actualizado exitosamente",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
        setEditingUser(null);
        loadUsers(); // Recargar la lista
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el usuario");
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al actualizar el usuario",
        icon: "error"
      });
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro de eliminar este usuario?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4000/api/usuarios/usuarios/${id}`, {
          method: "DELETE",
          headers: { 
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
          },
        });

        if (response.ok) {
          Swal.fire({
            title: "¡Eliminado!",
            text: "El usuario ha sido eliminado correctamente.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
          });
          loadUsers(); // Recargar la lista
        } else {
          throw new Error("Error al eliminar usuario");
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el usuario.",
          icon: "error"
        });
        console.log(error)
      }
    }
  };

  return (
    <div className="usersContainer fondo">
      <h2>Gestión de Usuarios</h2>

      {/* Barra de búsqueda */}
      <div className="input-group mb-3">
        <button 
          className="btn btn-outline-secondary" 
          type="button" 
          onClick={handleSearch}
        >
          Buscar
        </button>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Buscar usuario por ID, nombre o email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>

      {/* Lista de usuarios */}
      <div className="row">
        {filteredUsers.map(usuario => (
          <div key={usuario.id_user} className="col-md-6 mb-3">
            <div className="card user">
              <div className="card-body">
                <div className="cardTittle d-flex justify-content-between">
                  <h5 className="user-id">ID: {usuario.id_user}</h5>
                  <h5 className="user-name">{usuario.nombre}</h5>
                </div>
                <div className="cardTittle">
                  <h6>Email:</h6>
                  <p className="user-email">{usuario.email}</p>
                </div>
                <p><strong>Rol:</strong> {usuario.rol}</p>
              </div>
              <div className="card-body">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary me-2"
                  onClick={() => handleEdit(usuario)}
                >
                  Editar
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(usuario.id_user)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
                    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {editingUser && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">Editar usuario</h1>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setEditingUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="nombre" 
                      value={editForm.nombre}
                      onChange={(e) => setEditForm({...editForm, nombre: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="email" 
                      value={editForm.email}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="rol" className="form-label">Rol</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="rol" 
                      value={editForm.rol}
                      onChange={(e) => setEditForm({...editForm, rol: e.target.value})}
                      required 
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setEditingUser(null)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSave}
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;