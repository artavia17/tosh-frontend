import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import GetInto from "../GetInto";
import { useAuth } from "../../context/AuthContext";
import { useCountry } from "../../context/CountryContext";

const Navigation = () => {
  const { isAuthenticated } = useAuth();
  const { selectedCountry, setIsCountryModalOpen } = useCountry();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Inicializar estados de modales basados en localStorage - evita setState en useEffect
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(() => {
    const cookiePreference = localStorage.getItem('cookie_preference');
    return !cookiePreference; // Mostrar modal si no hay preferencia
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null);

  // Referencias para modales
  const cookieModalRef = useRef<HTMLDivElement>(null);

  // Cerrar menú con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMenuOpen) {
          setIsMenuOpen(false);
          menuButtonRef.current?.focus();
        }
        // Los modales pueden tener lógica específica de cierre con Escape
        if (isCookieModalOpen) {
          // Cookie modal es no-dismissible, no se cierra con Escape
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen, isCookieModalOpen]);

  // Manejar foco cuando se abre el menú
  useEffect(() => {
    if (isMenuOpen && firstMenuItemRef.current) {
      firstMenuItemRef.current.focus();
    }
  }, [isMenuOpen]);

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

    if (isCookieModalOpen) {
      return trapFocusInModal(cookieModalRef, isCookieModalOpen);
    }
  }, [isCookieModalOpen]);

  // Prevenir scroll cuando hay modal abierto - WCAG 2.4.3
  useEffect(() => {
    if (isCookieModalOpen) {
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
  }, [isCookieModalOpen]);

  // Detectar scroll para agregar clase - Performance optimizado
  useEffect(() => {
    let timeoutId: number;

    const handleScroll = () => {
      // Debounce para optimizar performance
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const scrollPosition = window.scrollY;

        if (scrollPosition > 10 && !isScrolled) {
          setIsScrolled(true);
        } else if (scrollPosition <= 10 && isScrolled) {
          setIsScrolled(false);
        }
      }, 10);
    };

    // Agregar listener de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Verificar posición inicial
    handleScroll();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);

  // Toggle del menú
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cerrar menú al navegar
  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  // Handlers para cookies
  const handleAcceptCookies = () => {
    localStorage.setItem('cookie_preference', 'accepted');
    setIsCookieModalOpen(false);
  };

  const handleRejectCookies = () => {
    localStorage.setItem('cookie_preference', 'rejected');
    setIsCookieModalOpen(false);
  };

  // Handlers para modal de login
  const handleLoginClose = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>

      {/* Botón de menú móvil - WCAG 2.1.1, 4.1.2 */}
      <button
        ref={menuButtonRef}
        onClick={toggleMenu}
        aria-label="Menú de navegación"
        aria-expanded={isMenuOpen}
        aria-controls="main-navigation"
        type="button"
        className={`menu-toggle ${isMenuOpen ? 'open' : 'closed'} ${isScrolled ? 'scrolled' : ''}`}
      >
        <span className="visually-hidden">
          {isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        </span>
        <span aria-hidden="true">
          <hr />
          <hr />
        </span>
      </button>

      {/* Navegación principal - WCAG 2.4.1, 4.1.2 */}
      <nav
        ref={navRef}
        id="main-navigation"
        aria-label="Navegación principal"
        role="navigation"
        className={isScrolled ? 'scrolled' : ''}
      >
        <section id="nav-menu" className={isMenuOpen ? 'open' : 'closed'}>
          <ul
            role="list"
            className="responsive-box"
            aria-label="Menú de navegación"
          >
            <li role="listitem">
              <NavLink
                ref={firstMenuItemRef}
                to="/"
                onClick={handleNavigation}
                aria-label="Ir a página de inicio"
              >
                {({ isActive }) => (
                  <span aria-current={isActive ? 'page' : undefined}>
                    Inicio
                  </span>
                )}
              </NavLink>
            </li>
            <li role="listitem">
              <NavLink
                to="/registrate"
                onClick={handleNavigation}
                aria-label="Ir a página de registro"
              >
                {({ isActive }) => (
                  <span aria-current={isActive ? 'page' : undefined}>
                    Registrate
                  </span>
                )}
              </NavLink>
            </li>
            <li role="listitem">
              {isAuthenticated ? (
                <NavLink
                  to="/ingresar-codigos"
                  onClick={handleNavigation}
                  aria-label="Ir a página de ingresar facturas"
                >
                  {({ isActive }) => (
                    <span aria-current={isActive ? 'page' : undefined}>
                      INGRESÁ FACTURAS
                    </span>
                  )}
                </NavLink>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    handleNavigation();
                    setIsLoginModalOpen(true);
                  }}
                  aria-label="Abrir modal para ingresar facturas promocionales"
                  className="nav-button"
                >
                  INGRESÁ FACTURAS
                </button>
              )}
            </li>
            <li role="listitem">
              <NavLink
                to="/ganadores"
                onClick={handleNavigation}
                aria-label="Ir a página de ganadores"
              >
                {({ isActive }) => (
                  <span aria-current={isActive ? 'page' : undefined}>
                    Ganadores
                  </span>
                )}
              </NavLink>
            </li>
            <li role="listitem">
              <NavLink
                to="/premios"
                onClick={handleNavigation}
                aria-label="Ir a página de premios"
              >
                {({ isActive }) => (
                  <span aria-current={isActive ? 'page' : undefined}>
                    Premios
                  </span>
                )}
              </NavLink>
            </li>
            {isAuthenticated ? (
              <li role="listitem">
                <NavLink
                  to="/mi-perfil"
                  onClick={handleNavigation}
                  aria-label="Ir a mi perfil de usuario"
                >
                  {({ isActive }) => (
                    <span aria-current={isActive ? 'page' : undefined}>
                      Mi perfil
                    </span>
                  )}
                </NavLink>
              </li>
            ) : (
              <li role="listitem">
                <button
                  onClick={() => {
                    handleNavigation();
                    setIsLoginModalOpen(true);
                  }}
                  aria-label="Abrir modal de inicio de sesión"
                  className="nav-button"
                >
                  Mi Perfil
                </button>
              </li>
            )}
            {/* Botón de cambiar país en menú móvil */}
            <li role="listitem">
              <button
                onClick={() => {
                  handleNavigation();
                  setIsCountryModalOpen(true);
                }}
                aria-label={selectedCountry ? `País seleccionado: ${selectedCountry.name}. Clic para cambiar` : 'Seleccionar país'}
                className="nav-button country-button-mobile"
              >
                <span>{selectedCountry?.name || 'Seleccionar país'}</span>
              </button>
            </li>
          </ul>


          {/* Enlaces adicionales fuera del menú móvil */}
          <div className="desktop-nav responsive-box " aria-label="Acciones de usuario">
            {/* Botón de país */}

            {isAuthenticated ? (
              <NavLink
                to="/mi-perfil"
                aria-label="Acceder a mi perfil de usuario"
              >
                {({ isActive }) => (
                  <span aria-current={isActive ? 'page' : undefined}>
                    Mi perfil
                  </span>
                )}
              </NavLink>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                aria-label="Abrir modal de inicio de sesión"
                className="nav-button"
              >
                Ingresar
              </button>
            )}
          </div>
        </section>
      </nav>

      {/* Modal para aceptar las cookies - WCAG 2.4.3, 4.1.2 */}
      {isCookieModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          aria-describedby="cookie-modal-description"
          className="modal-overlay cookies"
          ref={cookieModalRef}
        >
          <div className="modal-content responsive-box" role="document">
            <h2 id="cookie-modal-title" className="visually-hidden">
              Aviso de cookies
            </h2>
            <p id="cookie-modal-description" className="txt-medium">
              Al hacer clic en “Aceptar todas las cookies”, aceptás que las cookies se almacenen en tu dispositivo para mejorar la navegación del sitio, analizar su uso y colaborar con nuestros estudios con fines de marketing. Ver la política de tratamiento de datos personales.
            </p>
            <div role="group" aria-label="Opciones de cookies" className="cookie-buttons">
              <button
                onClick={handleAcceptCookies}
                type="button"
                aria-label="Aceptar todas las cookies y continuar"
                className="btn-code"
              >
                Aceptar todas las cookies
              </button>
              <button
                onClick={handleRejectCookies}
                type="button"
                aria-label="Rechazar cookies opcionales"
                className="btn-code"
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ingresar al perfil - WCAG 2.4.3, 4.1.2 */}
      <GetInto
        isOpen={isLoginModalOpen}
        onClose={handleLoginClose}
      />
    </>
  );
};

export default Navigation;
