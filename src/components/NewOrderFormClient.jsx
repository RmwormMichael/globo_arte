import React, { useState } from 'react';
import { createOrder } from '../services/orderService';
import Swal from 'sweetalert2';
import { getCurrentUser } from '../services/authService';

const NewOrderFormClient = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    date_order: '',
    direction: '',
    description: ''
  });

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
      Swal.fire({
        icon: 'warning',
        title: 'No autenticado',
        text: 'Inicia sesión para continuar.'
      });
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'No autenticado',
        text: 'Inicia sesión para continuar.'
      });
      return;
    }
  
    const { date_order, direction, description } = formData;
  
    if (!date_order || !direction || !description) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos obligatorios.'
      });
      return;
    }
  
    const orderData = {
      id_user: user.id,
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
          <label htmlFor="date_order" className="form-label">Fecha de Orden</label>
          <input
            type="datetime-local"
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

export default NewOrderFormClient;