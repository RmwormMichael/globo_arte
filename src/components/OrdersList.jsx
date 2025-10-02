import { useState, useEffect } from 'react';
import { getOrders, getUsers, updateOrder, deleteOrder } from '../services/orderService';
import Swal from 'sweetalert2';
import 'hover.css/css/hover-min.css';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
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
      
      // Buscar por estado
      if (statusMap[order.status]?.toLowerCase().includes(term)) return true;
      
      return false;
    });

    setFilteredOrders(filtered);
  };

  const handleSearch = () => {
    filterOrders();
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

  const handleEdit = (order) => {
    setEditingOrder(order);
    
    const orderDate = new Date(order.date_order);
    const formattedDate = orderDate.toISOString().slice(0, 16);
    
    setEditForm({
      description: order.description || '',
      direction: order.direction || '',
      date_order: formattedDate,
      status: order.status || 'en_proceso'
    });
  };

  const handleDelete = async (orderId) => {
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

  const handleSave = async () => {
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

  // Función para obtener clase de badge según el estado
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'entregado':
        return 'bg-success';
      case 'en_proceso':
        return 'bg-primary';
      case 'pendiente':
        return 'bg-warning';
      case 'cancelado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
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
    <div className="usersContainer fondo">
      <h2>Gestión de Órdenes</h2>

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
          placeholder="Buscar orden por ID, usuario, descripción o estado"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
      </div>

      {/* Tabla de órdenes */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Usuario</th>
              <th scope="col">Descripción</th>
              <th scope="col">Dirección</th>
              <th scope="col">Fecha Creación</th>
              <th scope="col">Fecha Entrega</th>
              <th scope="col">Estado</th>
              <th scope="col" className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {filteredOrders.map(order => (
              <tr key={order.id_order}>
                <th className='row-table align-middle' scope="row">{order.id_order}</th>
                <td className="align-middle">{getUserName(order.id_user)}</td>
                <td className="align-middle">
                  <div style={{maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {order.description}
                  </div>
                </td>
                <td className="align-middle">
                  <div style={{maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                    {order.direction}
                  </div>
                </td>
                <td className="align-middle">{formatDate(order.order_created_at)}</td>
                <td className="align-middle">{formatDate(order.date_order)}</td>
                <td className="align-middle">
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                    {statusMap[order.status] || order.status}
                  </span>
                </td>
                <td className="text-center align-middle">
                  <button 
                    type="button" 
                    className="btn btn-outline-info btn-editar btn-sm me-2 hvr-icon-pulse"
                    onClick={() => handleEdit(order)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil hvr-icon" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                    Editar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-danger btn-eliminar btn-sm hvr-icon-pulse"
                    onClick={() => handleDelete(order.id_order)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill hvr-icon icon-eliminar" viewBox="0 0 16 16">
                      <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                    </svg>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted">No se encontraron órdenes</p>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editingOrder && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">Editar Orden #{editingOrder.id_order}</h1>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setEditingOrder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripción</label>
                    <textarea 
                      className="form-control" 
                      id="description" 
                      rows="3"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="direction" className="form-label">Dirección</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="direction" 
                      value={editForm.direction}
                      onChange={(e) => setEditForm({...editForm, direction: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="date_order" className="form-label">Fecha de Entrega</label>
                    <input 
                      type="datetime-local" 
                      className="form-control" 
                      id="date_order" 
                      value={editForm.date_order}
                      onChange={(e) => setEditForm({...editForm, date_order: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Estado</label>
                    <select 
                      className="form-select" 
                      id="status" 
                      value={editForm.status}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      required
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En proceso</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setEditingOrder(null)}
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

export default OrdersList;