import "../App.css";
import { Haunted } from "react-halloween";

export default function GalleryGrid({ images, category }) {
  const isHalloween = category === "diseños";

  return (
    <section className="sectionGallery">

      {/* DECORACIONES SOLO EN HALLOWEEN (posición absoluta, encima del carrusel) */}
    {isHalloween && (
      <div className="ghost-layer">
        <div className="web-left" aria-hidden="true"></div>
        <div className="web-right" aria-hidden="true"></div>
      </div>
    )}

      {/* CARRUSEL BOOTSTRAP */}
      <div
        id={`carousel-${category}`}
        className="carousel slide carousel-fade customCarousel"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {images.map((image, index) => {
            // construimos la imagen (si es halloween, la animamos internamente)
            const imgElement = (
              <img
                src={image.src}
                className="d-block w-100 carouselImg"
                alt={image.alt}
              />
            );

            const content = isHalloween ? (
              <Haunted>{imgElement}</Haunted>
            ) : (
              imgElement
            );

            return (
              <div
                className={`carousel-item ${index === 0 ? "active" : ""}`}
                key={index}
              >
                {content}

                {/* Texto opcional si en el futuro le agregas name o price */}
                {(image.name || image.price) && (
                  <div className="carousel-caption d-none d-md-block">
                    {image.name && <h5>{image.name}</h5>}
                    {image.price && <p>{image.price}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CONTROLES */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target={`#carousel-${category}`}
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target={`#carousel-${category}`}
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </section>
  );
}
