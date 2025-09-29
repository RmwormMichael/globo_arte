import { useState, useEffect } from 'react';
import '../App.css';
import botonSubirImg from '../assets/img/botonSubir.png';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar/ocultar botón según el scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Función para desplazarse hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button 
          className="botonSubir" 
          onClick={scrollToTop}
          aria-label="Volver arriba"
        >
          <img className="flechaA" src={botonSubirImg} alt="Subir" />
        </button>
      )}
    </>
  );
}