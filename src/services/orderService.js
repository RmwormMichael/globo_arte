// services/orderService.js
const API_URL = 'https://api-2cvl.onrender.com/api';

// Funciones individuales - EXPORTADAS DIRECTAMENTE
export const createOrder = async (orderData, token) => {
  try {
    const response = await fetch(`${API_URL}/orders/`, {
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
};

export const getOrders = async (token) => {
  try {
    console.log('Obteniendo todas las órdenes...');
    const response = await fetch(`${API_URL}/orders`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Todas las órdenes obtenidas:', data);
    
    // ✅ Asegurar que siempre devolvemos un array
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error en getOrders:', error);
    // ✅ Devolver array vacío en caso de error
    return [];
  }
};

export const getUsers = async (token) => {
  try {
    const response = await fetch(`${API_URL}/usuarios`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener los usuarios');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error en getUsers:', error);
    return [];
  }
};

export const getOrderById = async (id, token) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Orden no encontrada.');
  return await response.json();
};

export const updateOrder = async (id, data, token) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Error al actualizar la orden.');
};

export const deleteOrder = async (id, token) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error al eliminar la orden.');
};

export const searchOrders = async (termino, token) => {
  const response = await fetch(`${API_URL}/orders/buscar?termino=${encodeURIComponent(termino)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Error al buscar órdenes.');
  return await response.json();
};

// Función para obtener las órdenes del cliente actual - MEJORADA
export const getOrdersByClient = async (token) => {
  try {
    console.log('Obteniendo órdenes del cliente...');
    const response = await fetch(`${API_URL}/orders/my-orders`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });
    
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Órdenes obtenidas:', data);
    return data;
  } catch (error) {
    console.error('Error en getOrdersByClient:', error);
    throw error;
  }
};

// Objeto orderService para compatibilidad (OPCIONAL - si lo necesitas)
const orderService = {
  createOrder,
  getOrders,
  getUsers,
  getOrderById,
  updateOrder,
  deleteOrder,
  searchOrders,
  getOrdersByClient
};

export default orderService;