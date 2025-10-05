import { useState, useEffect } from 'react';
import { createOrder } from '../services/orderService';
import { getUsers } from '../services/orderService';
import Swal from 'sweetalert2';
import "../assets/css/stylesUsers.css"

const NewOrderForm = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id_user: '',
    date_order: '',
    direction: '',
    description: ''
  });

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showAuthError();
        return;
      }

      const usuarios = await getUsers(token);
      setUsers(usuarios);
    } catch (error) {
      console.error('Error al cargar los usuarios:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los usuarios.'
      });
    }
  };

  const showAuthError = () => {
    Swal.fire({
      icon: 'warning',
      title: 'No autenticado',
      text: 'Inicia sesión para continuar.'
    }).then(() => {
      window.location.href = '/';
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      showAuthError();
      return;
    }
  
    const { id_user, date_order, direction, description } = formData;
  
    if (!id_user || !date_order || !direction || !description) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios.'
      });
      return;
    }
  
    const orderData = {
      id_user,
      status: 'en_proceso',
      date_order,
      direction,
      description,
    };
  
    try {
      setLoading(true);
      await createOrder(orderData, token);

      Swal.fire({
        icon: 'success',
        title: '¡Pedido creado!',
        text: 'La orden se ha registrado correctamente.'
      });

      // Resetear el formulario
      setFormData({
        id_user: '',
        date_order: '',
        direction: '',
        description: ''
      });
      
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `No se pudo crear el pedido: ${error.message}`
      });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container fondo">
      <div className='newSalesContainer '>
      <h2>Crear Nueva Orden</h2>
      <form className='newSalesForm' id="orderForm" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="id_user" className="form-label">Usuario</label>
          <select
            className="form-select"
            id="id_user"
            name="id_user"
            value={formData.id_user}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecciona un usuario</option>
            {users.map(usuario => (
              <option key={usuario.id_user} value={usuario.id_user}>
                {usuario.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="date_order" className="form-label">Fecha de Orden</label>
          <input
            type="date"
            className="form-control"
            id="date_order"
            name="date_order"
            value={formData.date_order}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="direction" className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            id="direction"
            name="direction"
            value={formData.direction}
            onChange={handleInputChange}
            placeholder="Ingresa la dirección de entrega"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe los detalles del pedido"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-outline-dark"
          disabled={loading}
        >
          {loading ? 'Creando pedido...' : 'Añadir Orden'}
        </button>
      </form>
      </div>
    </div>
  );
};

export default NewOrderForm;