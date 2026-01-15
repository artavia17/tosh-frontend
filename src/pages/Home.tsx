import { useState } from 'react';
import ImageHeaderDesktop from '../assets/img/webp/banner-home-desktop.webp';
import ImageReward from '../assets/img/webp/scooter.webp';
import ChickyEmpaque from '../assets/img/webp/toash-empaques.webp';
import ActivaImg from '../assets/img/webp/activa.webp';
import BananoImg from '../assets/img/png/banano.png';
import BarraImg from '../assets/img/png/barra.png';
import SEO from '../components/SEO';
import GetInto from '../components/GetInto';
import { Link } from 'react-router-dom';
import { useCountry } from '../context/CountryContext';

const Home = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { selectedCountry } = useCountry();

  // Obtener precio según el país seleccionado
  const getPriceByCountry = (): string => {
    if (!selectedCountry) return '₡4.000'; // Default to Costa Rica

    const prices: Record<string, string> = {
      'Guatemala': 'Q50,00',
      'El Salvador': '$7.00',
      'Costa Rica': '₡4.000'
    };

    return prices[selectedCountry.name] || '₡4.000';
  };

  return (
    <>
      {/* SEO Optimization */}
      <SEO
        title="Lo bueno de cuidarte - Registrá facturas y ganá premios exclusivos"
        description="Comprá Tosh, registrá tus facturas promocionales y ganá mochilas, loncheras y cartucheras de Lo bueno de cuidarte. Participá en la promoción oficial de Tosh y ganá premios increíbles."
        keywords="Tosh, Lo bueno de cuidarte, promoción, facturas promocionales, ganar premios, mochilas, loncheras, cartucheras, sorteo, Pozuelo"
        ogTitle="Lo bueno de cuidarte - ¡Participá y ganá!"
        ogDescription="Comprá Tosh, registrá facturas y ganá increíbles premios de Lo bueno de cuidarte"
        ogUrl="https://chikystrangerthings.com"
        canonical="https://chikystrangerthings.com"
      />
      {/* WCAG 2.4.1 - Landmark regions */}
      <header className='home top-space' role="banner" aria-label="Encabezado principal de Lo bueno de cuidarte">

        {/* Introducción al programa - WCAG 1.3.1 */}
        <section aria-labelledby="hero-heading" className="hero-section responsive-box">
          <h1 id="hero-heading" className="visually-hidden">
            Bienvenido a la promoción Lo bueno de cuidarte
          </h1>
          {/* WCAG 1.1.1 - Imágenes con texto alternativo descriptivo */}
          <section className='header-col'>
            <img
              src={ImageHeaderDesktop}
              alt="Banner promocional Lo bueno de cuidarte - Comprá, registrá facturas y ganá premios exclusivos"
              // className="desktop"
              loading="eager"
            />
            {/* <img
              src={ImageHeaderMobile}
              alt="Banner promocional Lo bueno de cuidarte - Comprá, registrá facturas y ganá premios exclusivos"
              className="mobile"
              loading="eager"
            /> */}
            <section className='reward-section'>
              <img src={ImageReward} alt="Premio scooter de la promoción Lo bueno de cuidarte" />
              <Link
                to="/registrate"
                aria-label="Ir a la página de registro de usuario"
                className="btn-code big"
              >
                  <span>
                    Registrate
                  </span>
              </Link>
            </section>
          </section>
        </section>
      </header>

      {/* WCAG 1.1.1 - Imagen decorativa */}
      <div className="decorative-border" aria-hidden="true"></div>

      {/* WCAG 2.4.1 - Main content landmark */}
      <main id="main-content" role="main" aria-label="Contenido principal" className='responsive-box'>

        {/* Cómo participar - WCAG 1.3.1, 2.4.6 */}
        <section aria-labelledby="como-participar-heading" className="how-to-participate-section">
          {/* Imagen decorativa izquierda - banano */}
          <img
            src={BananoImg}
            alt=""
            aria-hidden="true"
            className="decorative-image banano-image"
            loading="lazy"
          />

          {/* Imagen decorativa derecha - barra */}
          <img
            src={BarraImg}
            alt=""
            aria-hidden="true"
            className="decorative-image barra-image"
            loading="lazy"
          />

          <h2 id="como-participar-heading" className='text-transform-uppercase'>¿Cómo participar?</h2>

          {/* WCAG 1.3.1 - Lista ordenada semántica */}
          <ol
            className="steps-list"
            aria-label="Pasos para participar en la promoción"
          >
            <li>
              <div className="step-number" aria-label="Paso 1">
                <div>
                  <h2 aria-hidden="true">1</h2>
                </div>
              </div>
              <p>
                <strong>Comprá {getPriceByCountry()}</strong> en <br/> productos Tosh
              </p>
            </li>
            <li>
              <div className="step-number" aria-label="Paso 3">
                <div>
                  <h2 aria-hidden="true">2</h2>
                </div>
              </div>
              <p>
                <strong>Registrá</strong>tus datos <br/> y tus facturas
              </p>
            </li>
            <li>
               <div className="step-number" aria-label="Paso 1">
                <div>
                  <h2 aria-hidden="true">3</h2>
                </div>
              </div>
              <p>
                Participá por 1 de nuestras <strong>4 Scooters Xiaomi</strong>
              </p>
            </li>
          </ol>

          {/* WCAG 1.1.1 - Imagen de producto con alt descriptivo */}
          <figure role="group" aria-label="Imagen del producto Tosh" className='empaque'>
            <img
              src={ChickyEmpaque}
              alt="Empaque de producto Tosh con código promocional para participar"
              loading="lazy"
            />
          </figure>
        </section>

        {/* Estadísticas de premios - WCAG 1.3.1, 4.1.2 */}
        <section className='units-containers' aria-labelledby="estadisticas-heading">
          <h2 id="estadisticas-heading" className="visually-hidden">
            Estadísticas de premios disponibles
          </h2>

          {/* WCAG 1.1.1 - Imagen de premios */}
          <figure role="group" aria-label="Imagen de los premios">
            <img
              src={ActivaImg}
              alt="Premios disponibles: mochilas, loncheras y cartucheras de Lo bueno de cuidarte"
              loading="lazy"
            />
          </figure>
        </section>
      </main>

      {/* Modal de login */}
      <GetInto
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </>
  );
};

export default Home;
