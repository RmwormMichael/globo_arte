import { useState } from "react";
import GalleryGrid from "./GalleryGrid";
import "../App.css";

// Datos de las imágenes - centralizado y fácil de mantener
const categoriesData = {
  arcos: {
    images: [
      { src: "/src/assets/img/arcos/1.jpg", alt: "Arco decorativo 1" },
      { src: "/src/assets/img/arcos/2.jpg", alt: "Arco decorativo 2" },
      { src: "/src/assets/img/arcos/3.jpg", alt: "Arco decorativo 3" },
      { src: "/src/assets/img/arcos/4.jpg", alt: "Arco decorativo 4" },
      { src: "/src/assets/img/arcos/5.jpg", alt: "Arco decorativo 5" },
      { src: "/src/assets/img/arcos/6.jpg", alt: "Arco decorativo 6" },
      { src: "/src/assets/img/arcos/7.jpg", alt: "Arco decorativo 7" },
      { src: "/src/assets/img/arcos/8.jpg", alt: "Arco decorativo 8" },
      { src: "/src/assets/img/arcos/9.jpg", alt: "Arco decorativo 9" },
      { src: "/src/assets/img/arcos/10.jpg", alt: "Arco decorativo 10" },
    ],
  },
  bouquets: {
    images: [
      { src: "/src/assets/img/bouquets/1.jpg", alt: "Bouquet 1" },
      { src: "/src/assets/img/bouquets/2.jpg", alt: "Bouquet 2" },
      { src: "/src/assets/img/bouquets/3.jpg", alt: "Bouquet 3" },
      { src: "/src/assets/img/bouquets/4.jpg", alt: "Bouquet 4" },
      { src: "/src/assets/img/bouquets/5.jpg", alt: "Bouquet 5" },
      { src: "/src/assets/img/bouquets/6.jpg", alt: "Bouquet 6" },
      { src: "/src/assets/img/bouquets/7.jpg", alt: "Bouquet 7" },
      { src: "/src/assets/img/bouquets/8.jpg", alt: "Bouquet 8" },
      { src: "/src/assets/img/bouquets/9.jpg", alt: "Bouquet 9" },
      { src: "/src/assets/img/bouquets/10.jpg", alt: "Bouquet 10" },
    ],
  },
  diseños: {
    images: [
      { src: "/src/assets/img/especializados/1.jpg", alt: "Diseño especial 1" },
      { src: "/src/assets/img/especializados/2.jpg", alt: "Diseño especial 2" },
      { src: "/src/assets/img/especializados/3.jpg", alt: "Diseño especial 3" },
      { src: "/src/assets/img/especializados/4.jpg", alt: "Diseño especial 4" },
      { src: "/src/assets/img/especializados/5.jpg", alt: "Diseño especial 5" },
      { src: "/src/assets/img/especializados/6.jpg", alt: "Diseño especial 6" },
      { src: "/src/assets/img/especializados/7.jpg", alt: "Diseño especial 7" },
      { src: "/src/assets/img/especializados/8.jpg", alt: "Diseño especial 8" },
      { src: "/src/assets/img/especializados/9.jpg", alt: "Diseño especial 9" },
      {
        src: "/src/assets/img/especializados/10.jpg",
        alt: "Diseño especial 10",
      },
    ],
  },
};

export default function TemplatesGallery() {
  const [activeCategory, setActiveCategory] = useState("arcos");

  return (
    <div className="contenedorDos" id="gallery">
      {/* Navegación de categorías */}
      <nav className="navCategory">
        <button
          className={`btn btn-light ${
            activeCategory === "arcos" ? "active" : ""
          }`}
          onClick={() => setActiveCategory("arcos")}
        >
          Arcos
        </button>
        <button
          className={`btn btn-light ${
            activeCategory === "bouquets" ? "active" : ""
          }`}
          onClick={() => setActiveCategory("bouquets")}
        >
          Bouquets
        </button>
        <button
          className={`btn btn-light ${
            activeCategory === "diseños" ? "active" : ""
          }`}
          onClick={() => setActiveCategory("diseños")}
        >
          Diseños Especiales
        </button>
      </nav>

      {/* Galería dinámica */}
      <div
        id="mainCategory"
        data-aos="fade-right"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
      >
        <GalleryGrid
          category={activeCategory}
          images={categoriesData[activeCategory].images}
        />
      </div>
    </div>
  );
}
