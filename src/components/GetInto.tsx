import CloseIcon from '../assets/img/svg/close.svg';
import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

interface GetIntoProps {
  isOpen: boolean;
  onClose: () => void;
}

const GetInto = ({ isOpen, onClose }: GetIntoProps) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Prevenir scroll del body cuando el modal está abierto - WCAG 2.4.3
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Enfocar el input al abrir el modal
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Cerrar modal con tecla Escape - WCAG 2.1.1
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Trap de foco dentro del modal - WCAG 2.4.3
  useEffect(() => {
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
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  // Handler para el envío del formulario - WCAG 3.3.1
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!identificationNumber.trim()) {
      setError('Por favor, ingrese su número de identificación');
      return;
    }

    try {
      setIsSubmitting(true);

      // Intentar hacer login
      const response = await authService.signIn({
        id_number: identificationNumber
      });

      // Si el login fue exitoso
      if (response.data && response.data.token) {
        // Guardar el token y autenticar al usuario
        login(response.data.token);

        // Cerrar el modal
        handleClose();

        // Redirigir a ingresar facturas
        navigate('/ingresar-codigos');
      }
    } catch (error: any) {
      // Manejar errores
      if (error.status === 404) {
        setError('Usuario no encontrado. Por favor, verifica que el número de identificación sea exactamente igual al que ingresaste al registrarte.');
      } else {
        setError('Ocurrió un error al intentar iniciar sesión. Por favor intente nuevamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler para cerrar el modal
  const handleClose = () => {
    setIdentificationNumber('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      aria-describedby="login-modal-description"
      className="modal-overlay"
      ref={modalRef}
      onClick={(e) => {
        // Cerrar al hacer clic en el overlay
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="modal-content" role="document">
        {/* Botón de cerrar - WCAG 2.5.3 */}
        <button
          ref={closeButtonRef}
          onClick={handleClose}
          type="button"
          aria-label="Cerrar modal de inicio de sesión"
          className="modal-close-button"
        >
          <img
            src={CloseIcon}
            alt=""
            aria-hidden="true"
            role="presentation"
          />
          <span className="visually-hidden">Cerrar</span>
        </button>

        {/* Título del modal - WCAG 2.4.6 */}
        <h3 id="login-modal-title">
          INGRESÁ A TU PERFIL
        </h3>

        <p id="login-modal-description" className="visually-hidden">
          Ingresá tu número de identificación para acceder a su perfil
        </p>

        {/* Formulario de inicio de sesión - WCAG 3.3.1, 3.3.2 */}
        <form
          onSubmit={handleSubmit}
          aria-label="Formulario de inicio de sesión"
          noValidate
          className='normal'
        >
          <div className="form-field">
            <label htmlFor="identification-number">
              <span>N.° de identificación</span>
              <span className="required-indicator" aria-label="campo obligatorio">*</span>
            </label>
            <input
              ref={inputRef}
              type="text"
              id="identification-number"
              name="identification-number"
              value={identificationNumber}
              onChange={(e) => setIdentificationNumber(e.target.value)}
              required
              aria-required="true"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'error-identification-number' : 'desc-identification-number'}
              inputMode="numeric"
              autoComplete="off"
            />
            <p id="desc-identification-number" className="help-text">
              Ingresá el número de identificación exactamente igual a como lo registraste (incluyendo guiones y espacios si los tiene).
            </p>
            {/* WCAG 3.3.1 - Mensaje de error */}
            {error && (
              <span
                id="error-identification-number"
                className="error-message"
                role="alert"
              >
                {error}
              </span>
            )}
          </div>

          {/* Botón de envío - WCAG 2.5.3 */}
          <button
            type="submit"
            aria-label="Iniciar sesión con número de identificación"
            className="btn-accept submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GetInto;