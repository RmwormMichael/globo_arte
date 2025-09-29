import '../App.css';
import facebook from '../assets/img/facebook.svg';
import whatsapp from '../assets/img/whatsapp.svg';
import instagram from '../assets/img/instagram.svg';

export default function Footer() {
  return (
    <footer>
      <div className="footer">
        <h5 className="contacto">Contáctanos</h5>
        <div className="footerUno">
          <p className="dateFooter">Celular: (+57) 314 211 99 46</p>
          <p className="dateFooter">Bogotá, Colombia</p>
          <p className="dateFooter">Síguenos en nuestras redes:</p>
        </div>
        <div className="footerDos">
          <a href="https://www.facebook.com/share/1DfwVBr9ZL/" target="_blank" rel="noopener noreferrer">
            <img className="imgContact" src={facebook} alt="Facebook" />
          </a>
          <a href="https://wa.me/3142119946" target="_blank" rel="noopener noreferrer">
            <img className="imgContact" src={whatsapp} alt="WhatsApp" />
          </a>
          <a href="https://www.instagram.com/globo_arte_marthaperez?igsh=d3YycG52cDFyNWNw" target="_blank" rel="noopener noreferrer">
            <img className="imgContact" src={instagram} alt="Instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
}