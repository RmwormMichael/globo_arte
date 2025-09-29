export default function ClientDashboard({ user }) {
  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#f8f9fa',
      border: '3px solid #28a745',
      borderRadius: '10px',
      margin: '1rem',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#28a745' }}>¡Hola {user?.nombre}! 🎉</h1>
      <p>Bienvenido a tu panel de cliente</p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h2 style={{ color: '#495057' }}>Panel del Cliente</h2>
        <p>Aquí puedes gestionar tus pedidos y ver tu información.</p>
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-primary me-2">Ver Mis Pedidos</button>
          <button className="btn btn-success">Realizar Nuevo Pedido</button>
        </div>
      </div>
    </div>
  );
}