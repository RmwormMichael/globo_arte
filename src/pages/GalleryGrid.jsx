import '../App.css';

export default function GalleryGrid({ images }) {
  return (
    <section className="sectionGallery">
      <div className="grid">
        {images.map((image, index) => (
          <div key={index} className="producto">
            <img 
              className="productoImagen" 
              src={image.src} 
              alt={image.alt} 
            />
            <div className="productoInformacion">
              {image.name && <p className="productoNombre">{image.name}</p>}
              {image.price && <p className="productoPrecio">{image.price}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}