import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmailConfirmed() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir al home después de 5 segundos
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="text-center p-5 bg-white rounded shadow">
        <div className="mb-4">
          <div className="text-success" style={{ fontSize: '4rem' }}>✓</div>
        </div>
        <h1 className="h2 mb-3">¡Cuenta Confirmada Exitosamente! 🎉</h1>
        <p className="mb-4 text-muted">
          Tu cuenta ha sido verificada correctamente. Ahora puedes iniciar sesión en tu cuenta.
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          Ir al Inicio
        </button>
        <p className="mt-3 text-muted small">
          Serás redirigido automáticamente en 5 segundos...
        </p>
      </div>
    </div>
  );
}