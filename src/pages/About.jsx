import historia from '../assets/logo/historia.png';

export default function About() {
  return (
    <section className="section2" id="about">
      <div className="parrafoSegundo" data-aos="zoom-out">
        <img src={historia} className="globoTittle about" alt="Historia de Globo Arte" />
        <div>
          <p>
            <br /> Todo comenzó decorando pequeñas celebraciones para familiares y amigos, con globos, creatividad y muchas ganas de sorprender. Poco a poco, esa pasión por embellecer momentos especiales se transformó en una idea más grande: llevar alegría y color a cada rincón. <br /> <br />

            Con el tiempo, nuestras decoraciones empezaron a llamar la atención de más personas, y muy pronto nos encontramos trabajando en eventos más grandes, incluso para empresas que buscaban un toque único en sus celebraciones. <br /> <br />
            
            En 2018 dimos un paso importante: nos certificamos como Master Balloon Professional (MBP) en Serpentex, una distinción que reconoce la excelencia en el arte de la decoración con globos. Desde entonces, no hemos dejado de crecer, de aprender y, sobre todo, de soñar en grande junto a nuestros clientes. <br /> <br />
            
            Hoy, seguimos transformando ideas en experiencias inolvidables, con la misma pasión con la que empezamos.
          </p>
        </div>
      </div>
    </section>
  );
}