import { useState } from "react";
import GalleryGrid from "./GalleryGrid";
import "../App.css";
import { Eyes, Haunted } from "react-halloween";

// Importar las imágenes de fondo
import fondoArcos from "../assets/img/fondoUno.jpg";
import fondoBouquets from "../assets/img/fondoUno.jpg";
import fondoDisenos from "../assets/img/halloween/halloweenTwo.jpg";

// Datos de las imágenes centralizado
const categoriesData = {
  arcos: {
    background: fondoArcos,
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
    background: fondoBouquets,
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
    background: fondoDisenos,
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
      { src: "/src/assets/img/especializados/10.jpg", alt: "Diseño especial 10" },
    ],
  },
};

export default function TemplatesGallery() {
  const [activeCategory, setActiveCategory] = useState("arcos");

  return (
    <div
      className="contenedorDos"
      id="templates"    >
        <div
    className="contenedorDos-bg"
    style={{
      backgroundImage: `url(${categoriesData[activeCategory].background})`
    }}
  />
      {/* Overlay */}
      <div className="background-overlay"></div>

      {/* NAV + Haunted al pasar el mouse */}
      <nav className="navCategory">
    
          <button
            className={`btn btn-light hvr-buzz-out ${
              activeCategory === "arcos" ? "active" : ""
            }`}
            onClick={() => setActiveCategory("arcos")}
          >
            Arcos
          </button>
      

      
          <button
            className={`btn btn-light hvr-buzz-out ${
              activeCategory === "bouquets" ? "active" : ""
            }`}
            onClick={() => setActiveCategory("bouquets")}
          >
            Bouquets
          </button>
        

        <Haunted>
          <button
            className={`btn btn-light hvr-buzz-out ${
              activeCategory === "diseños" ? "active" : ""
            }`}
            onClick={() => setActiveCategory("diseños")}
          >
            Halloween
          </button>
        </Haunted>
      </nav>

      {/* OJOS HALLOWEEN SOLO EN DISEÑOS */}
      {activeCategory === "diseños" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            marginBottom: "20px",
            zIndex: 20,
          }}
        >
          <Eyes
            width={250}
            eyeBallColor="white"
            irisColor="#8a0303"
            pupilColor="black"
            animationTime={1}
            pupilSize={1.2}
            follow={true}
          />
        </div>
      )}

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
