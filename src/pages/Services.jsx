import nuestrosServicios from '../assets/logo/nuestrosServicios.png';
import globoArco from '../assets/img/1.jpg';
import bouquets from '../assets/img/2.jpg';
import disenosEspeciales from '../assets/img/11.jpg';

export default function ServicesSection() {
  return (
    <div className='contenedorServicios'>
    <div className="services" id="services">
      <h1 className="tituloImagen">
        <img 
          src={nuestrosServicios} 
          alt="Nuestros Servicios" 
          className="tituloImagen" 
        />
      </h1>
      <div className="servicesWrapper" >
        <div className="service" data-aos="fade-down-right">
          <img src={globoArco} alt="Globos con Helio" />
          <h4>Globos con Helio</h4>
          <p>
            Llevamos la magia de los globos flotantes directamente a tu hogar, 
            creando un ambiente encantador y lleno de sorpresa. ¡Haz que tu 
            celebración sea aún más especial con globos que se elevan por sí solos!
          </p>
        </div>
        <div className="service" data-aos="fade-up-left">
          <img src={bouquets} alt="Bouquets" />
          <h4>Bouquets</h4>
          <p>
            Diseños exclusivos para darle un toque especial a tu hogar u oficina 
            en esas fechas que merecen ser celebradas. ¡Haz que cada rincón brille 
            con elegancia y creatividad!
          </p>
        </div>
        <div className="service" data-aos="zoom-in-up">
          <img src={disenosEspeciales} alt="Diseños Especiales" />
          <h4>Diseños Especiales</h4>
          <p>
            ¡Haz que tu evento sea único con nuestros diseños de globos personalizados!
            ¿Tienes algo en mente? Cuéntanos tu idea y nosotros la haremos realidad. 
            ¡Sorprende a tus invitados con decoraciones impresionantes y personalizadas!
          </p>
        </div>
      </div>
    </div>
    </div>
  );
}