const API_URL = 'http://localhost:4000/api';

export const orderService = {
  async createOrder(orderData, token) {
    try {
      const response = await fetch(`${API_URL}/orders/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear el pedido');
      }
      
      return data;
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      throw error;
    }
  },

  async getOrders(token) {
    const response = await fetch(`${API_URL}/orders/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al obtener órdenes.');
    return await response.json();
  },

  async getUsers(token) {
    const response = await fetch(`${API_URL}/usuarios/usuarios`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al obtener los usuarios.');
    return await response.json();
  },

  async getOrderById(id, token) {
    const response = await fetch(`${API_URL}/orders/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Orden no encontrada.');
    return await response.json();
  },

  async updateOrder(id, data, token) {
    const response = await fetch(`${API_URL}/orders/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al actualizar la orden.');
  },

  async deleteOrder(id, token) {
    const response = await fetch(`${API_URL}/orders/orders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al eliminar la orden.');
  },

  async searchOrders(termino, token) {
    const response = await fetch(`${API_URL}/orders/buscar?termino=${encodeURIComponent(termino)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Error al buscar órdenes.');
    return await response.json();
  },
};

// Exportaciones individuales para uso más conveniente
export const createOrder = orderService.createOrder;
export const getOrders = orderService.getOrders;
export const getUsers = orderService.getUsers;
export const getOrderById = orderService.getOrderById;
export const updateOrder = orderService.updateOrder;
export const deleteOrder = orderService.deleteOrder;
export const searchOrders = orderService.searchOrders;

export default orderService;