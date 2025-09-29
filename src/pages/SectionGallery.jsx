import { useEffect, useRef } from 'react';
import productosDestacados from '../assets/logo/productosDestacados.png';

// Importar Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function SectionGallery() {
  const carouselRef = useRef(null);
  
  // Array de imágenes
  const images = [
    { src: "/src/assets/carrusel/1.jpg", alt: "Diseño de arco 1" },
    { src: "/src/assets/carrusel/2.jpg", alt: "Diseño de arco 2" },
    { src: "/src/assets/carrusel/3.jpg", alt: "Diseño de arco 3" },
    { src: "/src/assets/carrusel/4.jpg", alt: "Diseño de arco 4" },
    { src: "/src/assets/carrusel/5.jpg", alt: "Diseño de arco 5" },
    { src: "/src/assets/carrusel/6.jpg", alt: "Diseño de arco 6" },
    { src: "/src/assets/carrusel/7.jpg", alt: "Diseño de arco 7" }
  ];

  // Auto-slide con Bootstrap
  useEffect(() => {
    if (carouselRef.current) {
      const carousel = new window.bootstrap.Carousel(carouselRef.current, {
        interval: 12000,
        wrap: true,
        pause: false
      });
      
      return () => {
        carousel.dispose();
      };
    }
  }, []);

  return (
    <section className="galeria">
      <div className="tituloImagen">
        <img 
          src={productosDestacados}
          alt="Productos Destacados" 
          className="tituloImagen" 
        />
      </div>
      
      {/* Carrusel con Bootstrap nativo */}
      <div 
        id="carouselExampleIndicators" 
        className="carousel slide" 
        data-bs-ride="carousel"
        ref={carouselRef}
      >
        {/* Indicadores */}
        <div className="carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={index}
              className={index === 0 ? "active" : ""}
              aria-label={`Diapositiva ${index + 1}`}
              aria-current={index === 0 ? "true" : "false"}
            ></button>
          ))}
        </div>
        
        {/* Imágenes del carrusel */}
        <div className="carousel-inner">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                className="imgCarrusel d-block"
                src={image.src}
                alt={image.alt}
              />
            </div>
          ))}
        </div>
        
        {/* Controles anterior/siguiente */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Próximo</span>
        </button>
      </div>

      <div className="divCuadro" id="sectGallery">
        <a className="cuadroGallery" href="#gallery">
          Click aqui para ver mas diseños!
        </a>
      </div>
    </section>
  );
}