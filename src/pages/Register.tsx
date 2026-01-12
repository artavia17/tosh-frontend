import ChickyLogo from '../assets/img/webp/tosh-logo.webp';
import BorderIcon from '../assets/img/svg/border.svg';
import BorderBigIcon from '../assets/img/svg/border-big.svg';
import { useState } from 'react';
import GetInto from '../components/GetInto';
import RegisterForm from '../components/RegisterForm';
import { NavLink } from 'react-router-dom';
import SEO from '../components/SEO';
// import CharacterImg from '../assets/img/webp/character.webp';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { isAuthenticated } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Handlers para modal de login
    const handleOpenLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const handleLoginClose = () => {
        setIsLoginModalOpen(false);
    };

    return (
        <>
            {/* SEO Meta Tags */}
            <SEO
                title="Registrate - Chiky Stranger Things | Creá tu cuenta y ganá"
                description="Registrate en la promoción Chiky Stranger Things. Completá tus datos y empezá a ingresar facturas para ganar mochilas, loncheras y cartucheras de Stranger Things."
                keywords="registro Chiky, crear cuenta, formulario registro, Stranger Things promoción, registrarse, nueva cuenta, participar promoción"
                ogTitle="Registrate y Participá - Chiky Stranger Things"
                ogDescription="Creá tu cuenta gratis y empezá a participar por increíbles premios de Stranger Things con Chiky"
                ogUrl="https://chikystrangerthings.com/registrate"
                canonical="https://chikystrangerthings.com/registrate"
            />

            {/* WCAG 2.4.1 - Main landmark */}
            <main id="main-content" className='top-space register-page' role="main" aria-labelledby="register-heading">
                <div className='responsive-box'>
                    {/* Formulario para registrarse - WCAG 3.3.2 */}
                    <h1 id="register-heading">REGISTRATE Y GANÁ</h1>

                    <section aria-labelledby="register-form-section" className='register-form-section'>
                        <h2 id="register-form-section" className="visually-hidden">
                            Formulario de registro de usuario
                        </h2>

                        {/* WCAG 1.1.1 - Imagen descriptiva */}
                        {/* <img
                            src={CharacterImg}
                            alt="Personaje de Stranger Things"
                            loading="lazy"
                            className="character-image"
                        /> */}

                        {/* WCAG 1.1.1 - Logo descriptivo */}
                        <img
                            src={ChickyLogo}
                            alt="Logotipo de Chiky"
                            loading="lazy"
                            className="chicky-logo"
                        />

                        {/* Componente de formulario de registro */}
                        <RegisterForm />
                    </section>

                    {/* WCAG 1.1.1 - Imagen decorativa */}
                    <div className="decorative-border " aria-hidden="true">
                    </div>

                    {/* Ingresar facturas desde otra página - WCAG 2.4.6 */}
                    <section aria-labelledby="already-have-account" className='already-have-account'>
                        <h4 id="already-have-account">¿YA TENÉS CUENTA?</h4>
                        {isAuthenticated ? (
                            <NavLink
                                to="/ingresar-codigos"
                                aria-label="Ir a página de ingresar facturas"
                                className='btn-code'
                            >
                                Ingresá facturas
                            </NavLink>
                        ) : (
                            <button
                                type="button"
                                onClick={handleOpenLoginModal}
                                aria-label="Abrir modal para iniciar sesión e ingresar facturas"
                                className='btn-accept'
                            >
                                INGRESÁ FACTURAS
                            </button>
                        )}
                    </section>
                </div>
            </main>

            {/* Modal de inicio de sesión - WCAG 2.4.3, 4.1.2 */}
            <GetInto
                isOpen={isLoginModalOpen}
                onClose={handleLoginClose}
            />
        </>
    );
};

export default Register;
