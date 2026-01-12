import { NavLink } from 'react-router-dom';
import ArrowRightIcon from '../../assets/img/svg/arrow.right.circle.svg';
import ChickyLogo from '../../assets/img/webp/tosh-logo.webp';
import FacebookLogo from '../../assets/img/svg/facebook-logo.svg';
import InstagramLogo from '../../assets/img/svg/instagram-logo.svg';

const Footer = () => {
    return (
        // WCAG 2.4.1 - Landmark contentinfo
        <footer role="contentinfo" aria-label="Pie de página con información legal y enlaces de redes sociales" className="responsive-box">

            {/* Reglamento - WCAG 2.4.4 */}
            <nav aria-label="Enlaces legales principales" className="footer-reglamento-nav">
                <a
                    href="/pdf/reglamento.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Ver reglamento completo de la promoción"
                    className="reglamento-link"
                >
                    <span>
                        Ver reglamento
                    </span>
                    {/* WCAG 1.1.1 - Icono decorativo */}
                    <img
                        src={ArrowRightIcon}
                        alt=""
                        aria-hidden="true"
                        role="presentation"
                    />
                </a>
            </nav>

            {/* WCAG 1.3.1 - Contenedor del footer */}
            <section aria-label="Información de la empresa y redes sociales" className="footer-info-section">

                {/* Logo como enlace a inicio - WCAG 2.4.4 */}
                <NavLink
                    to="/"
                    aria-label="Volver a la página de inicio"
                    className="footer-logo-link"
                >
                    {({ isActive }) => (
                        <img
                            src={ChickyLogo}
                            alt="Logotipo de Chiky - Volver a inicio"
                            loading="lazy"
                            aria-current={isActive ? 'page' : undefined}
                        />
                    )}
                </NavLink>

                {/* WCAG 1.3.1 - Navegación secundaria y redes sociales */}
                <nav aria-label="Enlaces legales y redes sociales" className="footer-secondary-nav">
                    <ul role="list" className="footer-links-list">
                        {/* Enlaces legales - WCAG 2.4.4, 3.2.5 */}
                        <li>
                            <a
                                href="/pdf/terminos.pdf"
                                target='_black'
                                aria-label="Leer términos y condiciones de la promoción"
                            >
                                Términos y condiciones
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://somospozuelo.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visitar sitio web de Pozuelo (se abre en nueva pestaña)"
                            >
                                somospozuelo.com
                                <span className="visually-hidden"> (se abre en nueva ventana)</span>
                            </a>
                        </li>

                        {/* Redes sociales - WCAG 2.4.4, 1.1.1 */}
                        <li>
                            <a
                                href="https://www.facebook.com/TOSHBienestar"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visitar página de Facebook de Chiky (se abre en nueva pestaña)"
                                className="social-link"
                            >
                                <img
                                    src={FacebookLogo}
                                    alt=""
                                    aria-hidden="true"
                                    role="presentation"
                                />
                                <span className="visually-hidden">Facebook</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.instagram.com/toshbienestar/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Visitar perfil de Instagram de Chiky (se abre en nueva pestaña)"
                                className="social-link"
                            >
                                <img
                                    src={InstagramLogo}
                                    alt=""
                                    aria-hidden="true"
                                    role="presentation"
                                />
                                <span className="visually-hidden">Instagram</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </section>
        </footer>
    );
}

export default Footer;