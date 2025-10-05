// OrdersList.jsx - VERSIÓN MEJORADA
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
        status: 'en proceso'
    });

    // Mapeo de estados mejorado
    const statusMap = {
        'pendiente': { label: 'Pendiente', class: 'bg-warning' },
        'en proceso': { label: 'En proceso', class: 'bg-primary' },
        'entregado': { label: 'Entregado', class: 'bg-success' },
        'cancelado': { label: 'Cancelado', class: 'bg-danger' }
    };

    useEffect(() => {
        loadData();
    }, []);

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
            console.log('Cargando datos...');
            
            const [ordersData, usersData] = await Promise.all([
                getOrders(token),
                getUsers(token)
            ]);
            
            console.log('Datos cargados - Órdenes:', ordersData);
            console.log('Datos cargados - Usuarios:', usersData);
            
            setOrders(Array.isArray(ordersData) ? ordersData : []);
            setUsers(Array.isArray(usersData) ? usersData : []);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al cargar los datos: ' + error.message,
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const showAuthError = () => {
        Swal.fire({
            title: 'No autenticado',
            text: 'Debes iniciar sesión para ver esta página',
            icon: 'warning'
        });
    };

    const filterOrders = () => {
        if (!searchTerm.trim()) {
            setFilteredOrders(orders);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = orders.filter(order => {
            if (!order) return false;
            
            // Buscar por ID de orden
            if (order.id_order && order.id_order.toString().includes(term)) return true;
            
            // Buscar por nombre de usuario
            const user = users.find(u => u.id_user === order.id_user);
            if (user && user.nombre && user.nombre.toLowerCase().includes(term)) return true;
            
            // Buscar por descripción
            if (order.description && order.description.toLowerCase().includes(term)) return true;
            
            // Buscar por dirección
            if (order.direction && order.direction.toLowerCase().includes(term)) return true;
            
            // Buscar por estado
            const statusLabel = statusMap[order.status]?.label.toLowerCase();
            if (statusLabel && statusLabel.includes(term)) return true;
            
            return false;
        });

        setFilteredOrders(filtered);
    };

    const handleSearch = () => {
        filterOrders();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'No disponible';
        try {
            const date = new Date(dateStr);
            return date.toLocaleString('es-ES');
        } catch (error) {
            console.error('Error formateando fecha:', error);
            return 'Fecha inválida';
        }
    };

    const handleEdit = (order) => {
        setEditingOrder(order);
        setEditForm({
            description: order.description || '',
            direction: order.direction || '',
            date_order: order.date_order ? order.date_order.slice(0, 16) : '',
            status: order.status || 'en proceso'
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
                
                // Actualizar estado local
                setOrders(prev => prev.filter(order => order.id_order !== orderId));
                
                Swal.fire({
                    title: 'Eliminado',
                    text: 'La orden ha sido eliminada.',
                    icon: 'success',
                    timer: 1500
                });
            } catch (error) {
                console.error('Error eliminando orden:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo eliminar la orden: ' + error.message,
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

        try {
            await updateOrder(editingOrder.id_order, editForm, token);
            
            // Actualizar estado local
            setOrders(prev => 
                prev.map(order => 
                    order.id_order === editingOrder.id_order 
                        ? { ...order, ...editForm }
                        : order
                )
            );

            setEditingOrder(null);
            
            Swal.fire({
                title: 'Actualizado',
                text: 'Orden actualizada correctamente.',
                icon: 'success',
                timer: 1500
            });
        } catch (error) {
            console.error('Error actualizando orden:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar la orden: ' + error.message,
                icon: 'error'
            });
        }
    };

    const getUserName = (userId) => {
        const user = users.find(u => u.id_user === userId);
        return user ? user.nombre : `Usuario #${userId}`;
    };

    const getStatusBadgeClass = (status) => {
        return statusMap[status]?.class || 'bg-secondary';
    };

    const getStatusLabel = (status) => {
        return statusMap[status]?.label || status;
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
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
                    placeholder="Buscar por ID, usuario, descripción, dirección o estado"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && handleSearch()}
                />
            </div>

            {/* Información de resultados */}
            <div className="mb-3">
                <small className="text-muted">
                    Mostrando {filteredOrders.length} de {orders.length} órdenes
                </small>
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
                            <th scope="col">Fecha Entrega</th>
                            <th scope="col">Estado</th>
                            <th scope="col" className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <tr key={order.id_order}>
                                    <th scope="row">{order.id_order}</th>
                                    <td>{getUserName(order.id_user)}</td>
                                    <td>
                                        <div className="text-truncate" style={{maxWidth: '200px'}}>
                                            {order.description}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-truncate" style={{maxWidth: '150px'}}>
                                            {order.direction}
                                        </div>
                                    </td>
                                    <td>{formatDate(order.date_order)}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <button 
                                            className="btn btn-outline-info btn-sm me-2"
                                            onClick={() => handleEdit(order)}
                                        >
                                            Editar
                                        </button>
                                        <button 
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleDelete(order.id_order)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    <p className="text-muted">No se encontraron órdenes</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de edición */}
            {editingOrder && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Orden #{editingOrder.id_order}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setEditingOrder(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <textarea 
                                        className="form-control" 
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                        rows="3"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Dirección</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={editForm.direction}
                                        onChange={(e) => setEditForm({...editForm, direction: e.target.value})}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha de Entrega</label>
                                    <input 
                                        type="datetime-local" 
                                        className="form-control" 
                                        value={editForm.date_order}
                                        onChange={(e) => setEditForm({...editForm, date_order: e.target.value})}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Estado</label>
                                    <select 
                                        className="form-select" 
                                        value={editForm.status}
                                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="en proceso">En proceso</option>
                                        <option value="entregado">Entregado</option>
                                        <option value="cancelado">Cancelado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => setEditingOrder(null)}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleSave}
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