import  { useState, useEffect } from 'react';
import { getOrders, getUsers, updateOrder, deleteOrder } from '../services/orderService';
import Swal from 'sweetalert2';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    description: '',
    direction: '',
    date_order: '',
    status: 'en_proceso'
  });

  // Mapeo de estados
  const statusMap = {
    'pendiente': 'Pendiente',
    'en_proceso': 'En proceso',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  };

  // Cargar órdenes y usuarios al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  // Filtrar órdenes cuando cambia el searchTerm
  useEffect(() => {
    filterOrders();
  }, [searchTerm, orders, users]);

  const loadData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showAuthError();
      return;
    }

    try {
      setLoading(true);
      const [ordersData, usersData] = await Promise.all([
        getOrders(token),
        getUsers(token)
      ]);
      
      setOrders(ordersData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un error al obtener los datos.',
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const showAuthError = () => {
    Swal.fire({
      title: 'No autenticado',
      text: 'No estás autenticado. Inicia sesión.',
      icon: 'warning'
    }).then(() => {
      window.location.href = '/';
    });
  };

  const filterOrders = () => {
    if (!searchTerm.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = orders.filter(order => {
      // Buscar por ID de orden
      if (order.id_order.toString().includes(term)) return true;
      
      // Buscar por nombre de usuario
      const user = users.find(u => u.id_user === order.id_user);
      if (user && user.nombre.toLowerCase().includes(term)) return true;
      
      // Buscar por descripción
      if (order.description.toLowerCase().includes(term)) return true;
      
      return false;
    });

    setFilteredOrders(filtered);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      filterOrders();
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
      date_order: formattedDate,
      status: order.status || 'en_proceso'
    });
    
    setShowEditModal(true);
  };

  const handleDeleteClick = async (orderId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showAuthError();
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await deleteOrder(orderId, token);
        
        // Actualizar el estado removiendo la orden eliminada
        setOrders(prevOrders => prevOrders.filter(order => order.id_order !== orderId));
        
        Swal.fire({
          title: 'Eliminado',
          text: 'La orden ha sido eliminada con éxito.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la orden.',
          icon: 'error'
        });
      }
    }
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
      showAuthError();
      return;
    }

    const updatedOrder = {
      ...editForm,
      id_user: editingOrder.id_user
    };

    try {
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
        title: 'Actualizado',
        text: 'Orden actualizada con éxito.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la orden.',
        icon: 'error'
      });
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id_user === userId);
    return user ? user.nombre : 'Usuario no encontrado';
  };

  if (loading) {
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
      <h2>Lista de Órdenes</h2>
      
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
          placeholder="Buscar orden por ID o nombre de usuario"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={handleSearch}
        />
      </div>

      {/* Lista de órdenes */}
      <div className="row">
        {filteredOrders.map((order) => (
          <div key={order.id_order} className="col-md-6 col-lg-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <div className="cardTittle d-flex justify-content-between">
                  <h5 className="order-id">ID: {order.id_order}</h5>
                  <h5 className="user-name">{getUserName(order.id_user)}</h5>
                </div>
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
                  className="btn btn-outline-secondary me-2"
                  onClick={() => handleEditClick(order)}
                >
                  Editar
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-danger"
                  onClick={() => handleDeleteClick(order.id_order)}
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

      {filteredOrders.length === 0 && (
        <div className="text-center mt-4">
          <p>No se encontraron órdenes.</p>
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
                <form className="row g-3 needs-validation">
                  <div className="col-md-12">
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
                  <div className="col-md-12">
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
                  <div className="col-md-12">
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
                  <div className="col-md-12">
                    <label htmlFor="editStatus" className="form-label">Estado</label>
                    <select 
                      className="form-select" 
                      id="editStatus" 
                      name="status"
                      value={editForm.status}
                      onChange={handleEditFormChange}
                      required
                    >
                      <option value="en_proceso">En proceso</option>
                      <option value="entregado">Entregado</option>
                      <option value="pendiente">Pendiente</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
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
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;