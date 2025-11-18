import "../App.css";
import { Haunted } from "react-halloween";

export default function GalleryGrid({ images, category }) {
  const isHalloween = category === "diseños";

  return (
    <section className="sectionGallery">
      {isHalloween && (
        <>
          <div className="web-left"></div>
          <div className="web-right"></div>
        </>
      )}

      <div className="grid">
        {images.map((image, index) => {
          const product = (
            <div
              className={`producto ${isHalloween ? "productoHalloween" : ""}`}
            >
              <img className="productoImagen" src={image.src} alt={image.alt} />
              <div className="productoInformacion">
                {image.name && <p className="productoNombre">{image.name}</p>}
                {image.price && <p className="productoPrecio">{image.price}</p>}
              </div>
            </div>
          );

          return isHalloween ? (
            <Haunted key={index}>{product}</Haunted>
          ) : (
            <div key={index}>{product}</div>
          );
        })}
      </div>
    </section>
  );
}
