import SEO from '../components/SEO';
import VasoImg from '../assets/img/png/vaso-dos.png';
import BarritaImg from '../assets/img/png/barrita.png';

const PromotionalCode = () => {
    return (
        <>
            {/* SEO Meta Tags */}
            <SEO
                title="Ingresá Códigos - Lo bueno de cuidarte | Participá por premios"
                description="Ingresá tus facturas promocionales de Tosh y participá por mochilas, loncheras y cartucheras de Lo bueno de cuidarte. Comprá, registrá y ganá."
                keywords="ingresar facturas Tosh, facturas promocionales, participar sorteo, facturas Lo bueno de cuidarte, ingresar código, promoción Tosh"
                ogTitle="Ingresá tus Códigos - Lo bueno de cuidarte"
                ogDescription="Ingresá los facturas de tus productos Tosh y participá por premios exclusivos de Lo bueno de cuidarte"
                ogUrl="https://chikystrangerthings.com/ingresa-codigos"
                canonical="https://chikystrangerthings.com/ingresa-codigos"
            />

            <img
                src={BarritaImg}
                alt="Galleta Tosh"
                loading="lazy"
                className="top-left-absolute"
            />

            <img
                src={VasoImg}
                alt="Vaso Tosh"
                loading="lazy"
                className="bottom-right-absolute"
            />

            {/* WCAG 2.4.1 - Main landmark */}
            <main id="main-content" role="main" aria-labelledby="promo-code-heading" className='top-space promotional-code-page'>
                <div className='responsive-box'>
                    <section aria-labelledby="invoice-heading" className='register-form-section'>
                        <h1 id="invoice-heading">EL SORTEO HA FINALIZADO</h1>
                        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                            Gracias por participar en la promoción.<br />
                            El período de registro ha concluido.
                        </p>
                    </section>

                    {/* WCAG 1.1.1 - Imagen decorativa */}
                    <div className="decorative-border" aria-hidden="true"></div>
                </div>
            </main>
        </>
    );
};

export default PromotionalCode;
