import React, { useState, useEffect } from 'react';
import { getOrdersByClient, updateOrder } from '../services/orderService';
import Swal from 'sweetalert2';

const ClientOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    description: '',
    direction: '',
    date_order: ''
  });

  // Mapeo de estados
  const statusMap = {
    'pendiente': 'Pendiente',
    'en_proceso': 'En proceso',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
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
      const ordersData = await getOrdersByClient(token);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error al cargar las órdenes:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar las órdenes.'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  };

  const handleEditClick = (order) => {
    setEditingOrder(order);
    
    const orderDate = new Date(order.date_order);
    const formattedDate = orderDate.toISOString().slice(0, 16);
    
    setEditForm({
      description: order.description || '',
      direction: order.direction || '',
      date_order: formattedDate
    });
    
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
    if (!editingOrder) return;

    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Sesión expirada',
        text: 'Debes iniciar sesión nuevamente.'
      });
      return;
    }

    const updatedOrder = {
      ...editForm,
      id_user: editingOrder.id_user,
      status: editingOrder.status // Mantener el estado actual
    };

    try {
      setLoading(true);
      await updateOrder(editingOrder.id_order, updatedOrder, token);
      
      // Actualizar la orden en el estado
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id_order === editingOrder.id_order 
            ? { ...order, ...updatedOrder }
            : order
        )
      );

      setShowEditModal(false);
      setEditingOrder(null);
      
      Swal.fire({
        icon: 'success',
        title: 'Orden actualizada',
        text: 'La orden se actualizó correctamente.'
      });
    } catch (error) {
      console.error('Error al actualizar la orden:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar la orden.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container fondo">
      <h2>Mis Órdenes</h2>

      <div className="row">
        {orders.map((order) => (
          <div key={order.id_order} className="col-md-6 col-lg-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">ID: {order.id_order}</h5>
                <h6>Descripción:</h6>
                <p className="cardDescription">{order.description}</p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Dirección:</strong> {order.direction}
                </li>
                <li className="list-group-item">
                  <strong>Creado:</strong> {formatDate(order.order_created_at)}
                </li>
                <li className="list-group-item">
                  <strong>Entrega:</strong> {formatDate(order.date_order)}
                </li>
                <li className="list-group-item">
                  <strong>Estado:</strong> {statusMap[order.status] || order.status}
                </li>
              </ul>
              <div className="card-body">
                <button 
                  className="btn btn-warning"
                  onClick={() => handleEditClick(order)}
                >
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center mt-4">
          <p>No tienes órdenes registradas.</p>
        </div>
      )}

      {/* Modal de edición */}
      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Orden</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="editDescription" className="form-label">Descripción</label>
                    <textarea 
                      className="form-control" 
                      id="editDescription" 
                      name="description"
                      value={editForm.description}
                      onChange={handleEditFormChange}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDirection" className="form-label">Dirección</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="editDirection" 
                      name="direction"
                      value={editForm.direction}
                      onChange={handleEditFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editDeliveryDate" className="form-label">Fecha de Entrega</label>
                    <input 
                      type="datetime-local" 
                      className="form-control" 
                      id="editDeliveryDate" 
                      name="date_order"
                      value={editForm.date_order}
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
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleSaveChanges}
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientOrders;