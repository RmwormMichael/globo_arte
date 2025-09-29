export default function AdminDashboard({ user }) {
  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#fff3cd',
      border: '3px solid #ffc107',
      borderRadius: '10px',
      margin: '1rem',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#856404' }}>¡Hola Admin {user?.nombre}! ⚡</h1>
      <p>Panel de Administración</p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '1.5rem', 
        borderRadius: '8px',
        border: '1px solid #dee2e6'
      }}>
        <h2 style={{ color: '#495057' }}>Funciones de Administrador</h2>
        <p>Gestiona usuarios, pedidos y configuraciones del sistema.</p>
        <div style={{ marginTop: '1rem' }}>
          <button className="btn btn-warning me-2">Gestionar Usuarios</button>
          <button className="btn btn-info me-2">Ver Todos los Pedidos</button>
          <button className="btn btn-dark">Configuración</button>
        </div>
      </div>
    </div>
  );
}