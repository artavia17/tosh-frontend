import ChickyLogo from '../assets/img/webp/tosh-logo.webp';
import { useState, useEffect, useRef } from 'react';
import GetInto from '../components/GetInto';
import SEO from '../components/SEO';
import GalletaImg from '../assets/img/png/galleta.png';
import CerealImg from '../assets/img/png/cereal.png';
import VasoImg from '../assets/img/png/vaso.png';
const Register = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Estados para verificación de edad
    const [isAgeVerificationModalOpen, setIsAgeVerificationModalOpen] = useState(() => {
        const ageVerified = localStorage.getItem('age_verified');
        return !ageVerified; // Mostrar si no ha verificado la edad
    });
    const [isAgeRestrictionModalOpen, setIsAgeRestrictionModalOpen] = useState(false);

    // Referencias para modales
    const ageVerificationModalRef = useRef<HTMLDivElement>(null);
    const ageRestrictionModalRef = useRef<HTMLDivElement>(null);

    const handleLoginClose = () => {
        setIsLoginModalOpen(false);
    };

    // Handlers para verificación de edad
    const handleAgeYes = () => {
        localStorage.setItem('age_verified', 'true');
        setIsAgeVerificationModalOpen(false);
    };

    const handleAgeNo = () => {
        setIsAgeVerificationModalOpen(false);
        setIsAgeRestrictionModalOpen(true);
    };

    // Trap de foco para modales - WCAG 2.4.3
    useEffect(() => {
        const trapFocusInModal = (modalRef: React.RefObject<HTMLDivElement | null>, isOpen: boolean) => {
            if (!isOpen || !modalRef.current) return;

            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            const handleTabKey = (e: KeyboardEvent) => {
                if (e.key !== 'Tab') return;

                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement?.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement?.focus();
                        e.preventDefault();
                    }
                }
            };

            document.addEventListener('keydown', handleTabKey);
            firstElement?.focus();

            return () => document.removeEventListener('keydown', handleTabKey);
        };

        if (isAgeVerificationModalOpen) {
            return trapFocusInModal(ageVerificationModalRef, isAgeVerificationModalOpen);
        }
        if (isAgeRestrictionModalOpen) {
            return trapFocusInModal(ageRestrictionModalRef, isAgeRestrictionModalOpen);
        }
    }, [isAgeVerificationModalOpen, isAgeRestrictionModalOpen]);

    // Prevenir scroll cuando hay modal abierto - WCAG 2.4.3
    useEffect(() => {
        const hasOpenModal = isAgeVerificationModalOpen || isAgeRestrictionModalOpen;

        if (hasOpenModal) {
            document.body.style.overflow = 'hidden';
            document.body.setAttribute('aria-hidden', 'true');
        } else {
            document.body.style.overflow = '';
            document.body.removeAttribute('aria-hidden');
        }

        return () => {
            document.body.style.overflow = '';
            document.body.removeAttribute('aria-hidden');
        };
    }, [isAgeVerificationModalOpen, isAgeRestrictionModalOpen]);

    return (
        <>
            {/* SEO Meta Tags */}
            <SEO
                title="Registrate - Lo bueno de cuidarte | Creá tu cuenta y ganá"
                description="Registrate en la promoción Lo bueno de cuidarte. Completá tus datos y empezá a ingresar facturas para ganar mochilas, loncheras y cartucheras de Lo bueno de cuidarte."
                keywords="registro Tosh, crear cuenta, formulario registro, Lo bueno de cuidarte promoción, registrarse, nueva cuenta, participar promoción"
                ogTitle="Registrate y Participá - Lo bueno de cuidarte"
                ogDescription="Creá tu cuenta gratis y empezá a participar por increíbles premios de Lo bueno de cuidarte con Tosh"
                ogUrl="https://chikystrangerthings.com/registrate"
                canonical="https://chikystrangerthings.com/registrate"
            />

            <img
                src={GalletaImg}
                alt="Galleta Tosh"
                loading="lazy"
                className="top-left-absolute"
            />

            <img
                src={VasoImg}
                alt="Vaso Tosh"
                loading="lazy"
                className="bottom-left-absolute"
            />

            <img
                src={CerealImg}
                alt="Cereal Tosh"
                loading="lazy"
                className="bottom-right-absolute"
            />

            {/* WCAG 2.4.1 - Main landmark */}
            <main id="main-content" className='top-space register-page' role="main" aria-labelledby="register-heading">
                <div className='responsive-box'>
                    {/* Sorteo finalizado */}
                    <section aria-labelledby="register-form-section" className='register-form-section'>
                        <h2 id="register-form-section" className="visually-hidden">
                            Sorteo finalizado
                        </h2>

                        {/* WCAG 1.1.1 - Logo descriptivo */}
                        <img
                            src={ChickyLogo}
                            alt="Logotipo de Tosh"
                            loading="lazy"
                            className="chicky-logo"
                        />

                        <h1 id="register-heading">EL SORTEO HA FINALIZADO</h1>
                        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                            Gracias por participar en la promoción.<br />
                            El período de registro ha concluido.
                        </p>
                    </section>

                    {/* WCAG 1.1.1 - Imagen decorativa */}
                    <div className="decorative-border " aria-hidden="true">
                    </div>
                </div>
            </main>

            {/* Modal de inicio de sesión - WCAG 2.4.3, 4.1.2 */}
            <GetInto
                isOpen={isLoginModalOpen}
                onClose={handleLoginClose}
            />

            {/* Modal de verificación de edad - WCAG 2.4.3, 4.1.2 */}
            {isAgeVerificationModalOpen && (
                <div
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="age-verification-title"
                    className="modal-overlay"
                    ref={ageVerificationModalRef}
                >
                    <div className="modal-content responsive-box" role="document">
                        <h3 id="age-verification-title">
                            ¿SOS MAYOR DE EDAD?
                        </h3>
                        <p className="visually-hidden">
                            Para continuar, debe confirmar que es mayor de 18 años
                        </p>
                        <div role="group" aria-label="Verificación de edad" className="age-buttons">
                            <button
                                onClick={handleAgeYes}
                                type="button"
                                aria-label="Sí, soy mayor de 18 años"
                                className="btn-accept"
                                autoFocus
                            >
                                Sí
                            </button>
                            <button
                                onClick={handleAgeNo}
                                type="button"
                                aria-label="No, soy menor de 18 años"
                                className="btn-accept"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de restricción de edad - WCAG 2.4.3, 4.1.2 */}
            {isAgeRestrictionModalOpen && (
                <div
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="age-restriction-title"
                    aria-describedby="age-restriction-description"
                    aria-live="assertive"
                    className="modal-overlay"
                    ref={ageRestrictionModalRef}
                >
                    <div className="modal-content" role="document">
                        <h2 id="age-restriction-title">
                            LO SENTIMOS,
                        </h2>
                        <p id="age-restriction-description">
                            <strong>Solo pueden participar mayores de 18 años</strong>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Register;
