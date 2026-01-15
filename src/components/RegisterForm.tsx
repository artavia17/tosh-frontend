import { useState, useEffect, useRef, useCallback } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '../assets/img/svg/close.svg';
import CheckIcon from '../assets/img/svg/check.svg';
import countriesService from '../services/countries.service';
import authService from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { useCountry } from '../context/CountryContext';
import type { Country } from '../types/api';

const RegisterForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { selectedCountry: globalSelectedCountry } = useCountry();

    const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [showCommunicationChannels, setShowCommunicationChannels] = useState(false);

    // Estados para países y validaciones
    const [countries, setCountries] = useState<Country[]>([]);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [identificationNumber, setIdentificationNumber] = useState('');
    const [identificationType, setIdentificationType] = useState('');

    // Referencias para el modal de éxito
    const successModalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Obtener URL del reglamento según el país seleccionado
    const getReglamentoByCountry = (): string => {
        // Usar el país del contexto global si está disponible, sino el local del formulario
        const countryToUse = globalSelectedCountry || selectedCountry;

        if (!countryToUse) return '/pdf/reglamento-cr.pdf'; // Default a Costa Rica

        const reglamentos: Record<string, string> = {
            'Guatemala': '/pdf/reglamento-gt.pdf',
            'El Salvador': '/pdf/reglamento-els.pdf',
            'Costa Rica': '/pdf/reglamento-cr.pdf'
        };

        return reglamentos[countryToUse.name] || '/pdf/reglamento-cr.pdf';
    };

    // Cargar países al montar el componente
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setIsLoadingCountries(true);
                const response = await countriesService.getCountries();

                // Verificar que la respuesta tenga datos
                if (response && response.data && Array.isArray(response.data)) {
                    setCountries(response.data);
                } else {
                    console.error('Invalid countries response format:', response);
                    setCountries([]);
                }
            } catch (error) {
                console.error('Error loading countries:', error);
                setCountries([]);
            } finally {
                setIsLoadingCountries(false);
            }
        };

        fetchCountries();
    }, []);

    // Función para formatear número según el formato del país
    const formatNumber = (value: string, format: string, maxLength: number): string => {
        // Remover todo excepto números y letras
        const cleaned = value.replace(/[^0-9a-zA-Z]/g, '');

        // Limitar a la longitud máxima
        const limited = cleaned.substring(0, maxLength);

        let formatted = '';
        let valueIndex = 0;

        // Aplicar formato
        for (let i = 0; i < format.length && valueIndex < limited.length; i++) {
            if (format[i] === 'x' || format[i] === 'X') {
                formatted += limited[valueIndex];
                valueIndex++;
            } else {
                formatted += format[i];
            }
        }

        return formatted;
    };

    // Handler para cambio de país
    const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const countryId = parseInt(e.target.value);
        const country = countries.find(c => c.id === countryId);

        setSelectedCountry(country || null);

        // Resetear campos cuando cambia el país
        if (country) {
            setPhoneNumber(`+${country.phone_code} `);
            setIdentificationNumber('');
        } else {
            setPhoneNumber('');
            setIdentificationNumber('');
        }
    };

    // Handler para cambio de tipo de identificación
    const handleIdentificationTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setIdentificationType(e.target.value);
        setIdentificationNumber('');
    };

    // Handler para cambio de número de teléfono
    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!selectedCountry) return;

        const value = e.target.value;
        const phoneCode = `+${selectedCountry.phone_code} `;

        // No permitir eliminar el código de país
        if (!value.startsWith(phoneCode)) {
            setPhoneNumber(phoneCode);
            return;
        }

        // Obtener solo los dígitos después del código
        const digitsOnly = value.substring(phoneCode.length).replace(/[^0-9]/g, '');

        // Aplicar formato
        const formatted = formatNumber(
            digitsOnly,
            selectedCountry.phone_format,
            selectedCountry.phone_max_length
        );

        setPhoneNumber(phoneCode + formatted);
    };

    // Handler para cambio de número de identificación
    const handleIdentificationChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Para identificación nacional, usar formato del país
        if (identificationType === 'na' && selectedCountry) {
            const formatted = formatNumber(
                value,
                selectedCountry.id_format,
                selectedCountry.id_max_length
            );
            setIdentificationNumber(formatted);
        } else {
            // Para otros tipos (pasaporte, etc), permitir alfanumérico hasta 30 caracteres
            const cleaned = value.replace(/[^0-9a-zA-Z]/g, '');
            setIdentificationNumber(cleaned.substring(0, 30));
        }
    };

    // Handler para cerrar modal de éxito - WCAG 2.1.1
    const handleCloseSuccessModal = useCallback(() => {
        setIsSuccessModalOpen(false);
        navigate('/ingresar-codigos');
    }, [navigate]);

    // Prevenir scroll del body cuando el modal está abierto - WCAG 2.4.3
    useEffect(() => {
        if (isSuccessModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isSuccessModalOpen]);

    // Cerrar modal de éxito con tecla Escape - WCAG 2.1.1
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isSuccessModalOpen) {
                handleCloseSuccessModal();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isSuccessModalOpen, handleCloseSuccessModal]);

    // Trap de foco en modal de éxito - WCAG 2.4.3
    useEffect(() => {
        if (!isSuccessModalOpen || !successModalRef.current) return;

        const focusableElements = successModalRef.current.querySelectorAll(
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
        closeButtonRef.current?.focus();

        return () => document.removeEventListener('keydown', handleTabKey);
    }, [isSuccessModalOpen]);

    // Handler para validación del formulario
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Limpiar errores previos
        setFormErrors({});

        // Obtener datos del formulario
        const formData = new FormData(e.currentTarget);

        // Extraer solo los dígitos del teléfono (sin el código de país y formato)
        const phoneDigitsOnly = phoneNumber
            .substring(`+${selectedCountry?.phone_code} `.length)
            .replace(/[^0-9]/g, '');

        // Preparar datos para el registro
        const registerData = {
            name: formData.get('fullname') as string,
            email: formData.get('email') as string,
            country_id: selectedCountry?.id || 0,
            id_type: identificationType === 'na' ? 'Cédula' : identificationType === 'passport' ? 'Pasaporte' : 'Otro',
            id_number: identificationNumber,
            phone_number: phoneDigitsOnly,
            marketing_opt_in: formData.get('communicationsConsent') === 'on',
            whatsapp_opt_in: formData.get('whatsappConsent') === 'on',
            phone_opt_in: formData.get('phoneConsent') === 'on',
            email_opt_in: formData.get('emailConsent') === 'on',
            sms_opt_in: formData.get('smsConsent') === 'on',
            data_treatment_accepted: formData.get('dataPolicyConsent') === 'on',
            terms_accepted: formData.get('termsAndConditions') === 'on',
        };

        try {
            setIsSubmitting(true);

            // Llamar al servicio de registro
            const response = await authService.register(registerData);

            // Si el registro fue exitoso
            if (response.data && response.data.token) {
                // Guardar el token y autenticar al usuario
                login(response.data.token);

                // Mostrar modal de éxito
                setIsSuccessModalOpen(true);
            }
        } catch (error: unknown) {
            // Manejar errores de validación
            const apiError = error as { status?: number; errors?: Record<string, string[]>; message?: string };

            if (apiError.status === 422 && apiError.errors) {
                setFormErrors(apiError.errors);
            } else {
                console.error('Error en el registro:', error);
                setFormErrors({
                    general: [apiError.message || 'Ocurrió un error al registrar. Por favor intente nuevamente.']
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* WCAG 3.3.1, 3.3.2 - Formulario accesible */}
            <form
                onSubmit={handleSubmit}
                aria-label="Formulario de registro"
                noValidate
                className='normal'
            >
                {/* Error general */}
                {formErrors.general && (
                    <div className="error-message general-error" role="alert">
                        {formErrors.general[0]}
                    </div>
                )}

                {/* WCAG 1.3.1 - Campo de nombre */}
                <div className="form-field">
                    <label htmlFor="nombre-completo">
                        <span>Nombre completo</span>
                        <span className="required-indicator" aria-label="campo obligatorio">*</span>
                    </label>
                    <input
                        type="text"
                        name="fullname"
                        id="nombre-completo"
                        required
                        aria-required="true"
                        aria-invalid={formErrors.name ? 'true' : 'false'}
                        aria-describedby={formErrors.name ? 'error-nombre-completo' : undefined}
                        autoComplete="name"
                        maxLength={30}
                    />
                    {formErrors.name && (
                        <span id="error-nombre-completo" className="error-message" role="alert">
                            {formErrors.name[0]}
                        </span>
                    )}
                </div>

                {/* WCAG 1.3.1 - Grupo de campos relacionados */}
                <div className="form-row" role="group" aria-labelledby="group-pais-email">
                    <span id="group-pais-email" className="visually-hidden">
                        País y correo electrónico
                    </span>

                    <div className="form-field">
                        <label htmlFor="pais">
                            País
                            <span className="required-indicator" aria-label="campo obligatorio">*</span>
                        </label>
                        <select
                            name="country"
                            id="pais"
                            required
                            aria-required="true"
                            aria-invalid={formErrors.country ? 'true' : 'false'}
                            aria-describedby={formErrors.country ? 'error-pais' : undefined}
                            autoComplete="country-name"
                            onChange={handleCountryChange}
                            disabled={isLoadingCountries}
                        >
                            <option value="">
                                {isLoadingCountries ? 'Cargando países...' : 'Seleccione una opción'}
                            </option>
                            {countries && countries.length > 0 && countries.map((country) => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                        {formErrors.country_id && (
                            <span id="error-pais" className="error-message" role="alert">
                                {formErrors.country_id[0]}
                            </span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="correo-electronico">
                            <span>Correo electrónico</span>
                            <span className="required-indicator" aria-label="campo obligatorio">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="correo-electronico"
                            required
                            aria-required="true"
                            aria-invalid={formErrors.email ? 'true' : 'false'}
                            aria-describedby={formErrors.email ? 'error-correo-electronico' : 'desc-correo-electronico'}
                            autoComplete="email"
                            inputMode="email"
                            maxLength={30}
                        />
                        <span id="desc-correo-electronico" className="visually-hidden">
                            Ingrese un correo electrónico válido
                        </span>
                        {formErrors.email && (
                            <span id="error-correo-electronico" className="error-message" role="alert">
                                {formErrors.email[0]}
                            </span>
                        )}
                    </div>
                </div>

                {/* WCAG 1.3.1 - Tipo de identificación */}
                <div className="form-field">
                    <label htmlFor="tipo-identificacion">
                        <span>Tipo de identificación</span>
                        <span className="required-indicator" aria-label="campo obligatorio">*</span>
                    </label>
                    <select
                        name="identificationType"
                        id="tipo-identificacion"
                        required
                        aria-required="true"
                        aria-invalid={formErrors.id_type ? 'true' : 'false'}
                        aria-describedby={formErrors.id_type ? 'error-tipo-identificacion' : undefined}
                        value={identificationType}
                        onChange={handleIdentificationTypeChange}
                        disabled={!selectedCountry}
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="na">Nacional</option>
                        <option value="passport">Pasaporte</option>
                        <option value="other">Otro</option>
                    </select>
                    {formErrors.id_type && (
                        <span id="error-tipo-identificacion" className="error-message" role="alert">
                            {formErrors.id_type[0]}
                        </span>
                    )}
                </div>

                {/* WCAG 1.3.1 - Grupo de identificación y teléfono */}
                <div className="form-row" role="group" aria-labelledby="group-identificacion-telefono">
                    <span id="group-identificacion-telefono" className="visually-hidden">
                        Número de identificación y teléfono
                    </span>

                    <div className="form-field">
                        <label htmlFor="numero-identificacion">
                            <span>N.º identificación</span>
                            <span className="required-indicator" aria-label="campo obligatorio">*</span>
                        </label>
                        <input
                            type="text"
                            name="identificationNumber"
                            id="numero-identificacion"
                            required
                            aria-required="true"
                            aria-invalid={formErrors.id_number ? 'true' : 'false'}
                            aria-describedby={formErrors.id_number ? 'error-numero-identificacion' : undefined}
                            inputMode={identificationType === 'na' ? 'numeric' : 'text'}
                            value={identificationNumber}
                            onChange={handleIdentificationChange}
                            disabled={!selectedCountry || !identificationType}
                            placeholder={
                                !selectedCountry
                                    ? 'Seleccione un país primero'
                                    : !identificationType
                                    ? 'Seleccione tipo de identificación'
                                    : identificationType === 'na' && selectedCountry
                                    ? `Formato: ${selectedCountry.id_format}`
                                    : 'Ingresá tu número de identificación'
                            }
                        />
                        {formErrors.id_number && (
                            <span id="error-numero-identificacion" className="error-message" role="alert">
                                {formErrors.id_number[0]}
                            </span>
                        )}
                    </div>

                    <div className="form-field">
                        <label htmlFor="numero-telefono">
                            <span>N.º de teléfono</span>
                            <span className="required-indicator" aria-label="campo obligatorio">*</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            id="numero-telefono"
                            required
                            aria-required="true"
                            aria-invalid={formErrors.phone_number ? 'true' : 'false'}
                            aria-describedby={formErrors.phone_number ? 'error-numero-telefono' : undefined}
                            autoComplete="tel"
                            inputMode="tel"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            disabled={!selectedCountry}
                            placeholder={
                                !selectedCountry
                                    ? 'Seleccione un país primero'
                                    : `Formato: +${selectedCountry.phone_code} ${selectedCountry.phone_format}`
                            }
                        />
                        {formErrors.phone_number && (
                            <span id="error-numero-telefono" className="error-message" role="alert">
                                {formErrors.phone_number[0]}
                            </span>
                        )}
                    </div>
                </div>

                {/* WCAG 1.3.1, 3.3.2 - Grupo de consentimientos */}
                <fieldset aria-labelledby="consent-legend">
                    <legend id="consent-legend" className="visually-hidden">
                        Consentimientos y aceptaciones
                    </legend>

                    <div className="form-checkbox">
                        <input
                            type="checkbox"
                            name="communicationsConsent"
                            id="communicationsConsent"
                            required
                            aria-required="true"
                            aria-invalid={formErrors.marketing_opt_in ? 'true' : 'false'}
                            aria-describedby={formErrors.marketing_opt_in ? 'error-communications-consent desc-communications-consent' : 'desc-communications-consent'}
                            aria-controls="communication-channels"
                            onChange={(e) => setShowCommunicationChannels(e.target.checked)}
                        />
                        <label htmlFor="communicationsConsent">
                            <span>Autorizo recibir comunicaciones sobre actividades, eventos y promociones de la marca Tosh.</span>
                            <span className="required-indicator" aria-label="campo obligatorio">*</span>
                        </label>
                        <span id="desc-communications-consent" className="visually-hidden">
                            Al marcar esta opción, se mostrarán las opciones para seleccionar los canales de comunicación
                        </span>
                        {formErrors.marketing_opt_in && (
                            <span id="error-communications-consent" className="error-message" role="alert">
                                {formErrors.marketing_opt_in[0]}
                            </span>
                        )}
                    </div>

                    {/* Canales de comunicación - WCAG 1.3.1, 4.1.2 */}
                    {showCommunicationChannels && (
                        <div
                            id="communication-channels"
                            className="communication-channels"
                            role="group"
                            aria-labelledby="communication-channels-legend"
                            aria-live="polite"
                        >
                            <p id="communication-channels-legend" className="channels-legend">
                                Seleccione los canales por los cuales autoriza ser contactado:
                            </p>

                            {/* WhatsApp */}
                            <div className="form-checkbox form-checkbox-nested">
                                <input
                                    type="checkbox"
                                    name="whatsappConsent"
                                    id="whatsappConsent"
                                    aria-describedby="desc-whatsapp"
                                />
                                <label htmlFor="whatsappConsent">
                                    <span>Autorizo ser contactado por WhatsApp</span>
                                </label>
                                <span id="desc-whatsapp" className="visually-hidden">
                                    Recibirá mensajes de WhatsApp sobre promociones y eventos de Tosh
                                </span>
                            </div>

                            {/* Teléfono */}
                            <div className="form-checkbox form-checkbox-nested">
                                <input
                                    type="checkbox"
                                    name="phoneConsent"
                                    id="phoneConsent"
                                    aria-describedby="desc-phone"
                                />
                                <label htmlFor="phoneConsent">
                                    <span>Autorizo ser contactado por teléfono</span>
                                </label>
                                <span id="desc-phone" className="visually-hidden">
                                    Recibirá llamadas telefónicas sobre promociones y eventos de Tosh
                                </span>
                            </div>

                            {/* Correo electrónico */}
                            <div className="form-checkbox form-checkbox-nested">
                                <input
                                    type="checkbox"
                                    name="emailConsent"
                                    id="emailConsent"
                                    aria-describedby="desc-email"
                                />
                                <label htmlFor="emailConsent">
                                    <span>Autorizo ser contactado por correo electrónico</span>
                                </label>
                                <span id="desc-email" className="visually-hidden">
                                    Recibirá correos electrónicos sobre promociones y eventos de Tosh
                                </span>
                            </div>

                            {/* SMS */}
                            <div className="form-checkbox form-checkbox-nested">
                                <input
                                    type="checkbox"
                                    name="smsConsent"
                                    id="smsConsent"
                                    aria-describedby="desc-sms"
                                />
                                <label htmlFor="smsConsent">
                                    <span>Autorizo ser contactado por SMS</span>
                                </label>
                                <span id="desc-sms" className="visually-hidden">
                                    Recibirá mensajes de texto SMS sobre promociones y eventos de Tosh
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="form-checkbox">
                        <input
                            type="checkbox"
                            name="dataPolicyConsent"
                            id="dataPolicyConsent"
                            required
                            aria-required="true"
                            aria-invalid={formErrors.data_treatment_accepted ? 'true' : 'false'}
                            aria-describedby={formErrors.data_treatment_accepted ? 'error-data-policy-consent' : undefined}
                        />
                        <label htmlFor="dataPolicyConsent">
                            <span>Autorizo la <a href="/pdf/politicas.pdf" target="_blank" rel="noopener noreferrer">política de tratamiento de datos</a>.</span>
                            <span className="required-indicator" aria-label="campo obligatorio">*</span>
                        </label>
                        {formErrors.data_treatment_accepted && (
                            <span id="error-data-policy-consent" className="error-message" role="alert">
                                {formErrors.data_treatment_accepted[0]}
                            </span>
                        )}
                    </div>

                    <div className="form-checkbox">
                        <input
                            type="checkbox"
                            name="termsAndConditions"
                            id="termsAndConditions"
                            required
                            aria-required="true"
                            aria-invalid={formErrors.terms_accepted ? 'true' : 'false'}
                            aria-describedby={formErrors.terms_accepted ? 'error-terms-conditions' : undefined}
                        />
                        <label htmlFor="termsAndConditions">
                            <span>Autorizo los <a href={getReglamentoByCountry()} target="_blank" rel="noopener noreferrer">términos y condiciones</a>.</span>
                            <span className="required-indicator" aria-label="campo obligatorio">*</span>
                        </label>
                        {formErrors.terms_accepted && (
                            <span id="error-terms-conditions" className="error-message" role="alert">
                                {formErrors.terms_accepted[0]}
                            </span>
                        )}
                    </div>
                </fieldset>

                {/* WCAG 2.5.3 - Botón de envío */}
                <button
                    type="submit"
                    aria-label="Enviar formulario de registro"
                    className='btn-code'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Registrando...' : 'Registrate'}
                </button>
            </form>

            {/* Modal de registro exitoso - WCAG 2.4.3, 4.1.2 */}
            {isSuccessModalOpen && (
                <div
                    role="alertdialog"
                    aria-modal="true"
                    aria-labelledby="success-modal-title"
                    aria-describedby="success-modal-description"
                    aria-live="assertive"
                    className="modal-overlay"
                    ref={successModalRef}
                    onClick={(e) => {
                        // Cerrar al hacer clic en el overlay
                        if (e.target === e.currentTarget) {
                            handleCloseSuccessModal();
                        }
                    }}
                >
                    <div className="modal-content" role="document">
                        {/* Botón de cerrar - WCAG 2.5.3 */}
                        <button
                            ref={closeButtonRef}
                            onClick={handleCloseSuccessModal}
                            type="button"
                            aria-label="Cerrar modal de registro exitoso"
                            className="modal-close-button"
                            autoFocus
                        >
                            <img
                                src={CloseIcon}
                                alt=""
                                aria-hidden="true"
                                role="presentation"
                            />
                            <span className="visually-hidden">Cerrar</span>
                        </button>

                        {/* Icono de éxito - WCAG 1.1.1 */}
                        <img
                            src={CheckIcon}
                            alt="Icono de éxito"
                            role="img"
                            aria-label="Registro completado exitosamente"
                            className='icon'
                        />

                        {/* Título - WCAG 2.4.6 */}
                        <h2 id="success-modal-title">
                            REGISTRO EXITOSO
                        </h2>

                        {/* Descripción oculta para lectores de pantalla - WCAG 1.3.1 */}
                        <p id="success-modal-description" className="visually-hidden">
                            Tu cuenta ha sido creada exitosamente. Ahora puedes ingresar facturas y participar en la promoción.
                        </p>

                        {/* Botón de acción - WCAG 2.5.3 */}
                        <button
                            onClick={handleCloseSuccessModal}
                            aria-label="Ir a la página para ingresar facturas promocionales"
                            className='btn-accept'
                        >
                            INGRESÁ FACTURAS
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default RegisterForm;
