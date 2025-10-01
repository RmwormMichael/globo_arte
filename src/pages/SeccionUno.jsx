import imgLogo from "../assets/logo/globoArteLogo.png";

export default function SeccionUno() {
  return (
    <div className="contenedorUno">
      <div className="contenido-interno">
        <img 
          src={imgLogo} 
          className="imglogo" 
          alt="logo grande"
          data-aos="fade-up" 
          data-aos-anchor-placement="bottom-bottom" 
          data-aos-duration="5000" 
        />
        <p 
          className="parrafoPrimero" 
          data-aos="fade-down" 
          data-aos-easing="linear" 
          data-aos-duration="5000"
        >
          En nuestra empresa nos especializamos en la decoración con globos,
          creando experiencias únicas para eventos familiares y corporativos. Nos
          apasiona transformar cualquier ocasión en algo verdaderamente especial,
          con diseños innovadores y creativos que sorprenden y encantan. Cada
          detalle está pensado para hacer de tu evento un recuerdo inolvidable.
          ¡Descubre cómo podemos darle un toque único a tu próxima celebración!
          ¡Te invitamos a explorar nuestras ideas y a soñar en grande con
          nosotros!. En nuestro menú encontrarás la opción de registrarte e
          iniciar sesión con tu correo. Desde allí podrás contactarnos y crear una
          orden personalizada para tu decoración ideal. ¡Te esperamos!
        </p>
      </div>
    </div>
  );
}