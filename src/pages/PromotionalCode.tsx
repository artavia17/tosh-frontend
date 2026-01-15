import { NavLink } from 'react-router-dom';
import { useState, useRef } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import SEO from '../components/SEO';
import codesService from '../services/codes.service';
import { useAuth } from '../context/AuthContext';
import VasoImg from '../assets/img/png/vaso-dos.png';
import BarritaImg from '../assets/img/png/barrita.png';

const PromotionalCode = () => {
    const { refreshUser } = useAuth();
    const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Handler para cambio de archivo - WCAG 3.3.1
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            // Validar tipo de archivo
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                setError('Solo se permiten archivos de imagen (JPG, PNG, WEBP)');
                setInvoiceFile(null);
                return;
            }

            // Validar tamaño (máximo 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setError('El archivo no debe superar los 5MB');
                setInvoiceFile(null);
                return;
            }

            setInvoiceFile(file);
        }

        // Limpiar error al seleccionar archivo
        if (error) {
            setError('');
        }
        // Limpiar mensaje de éxito al seleccionar archivo
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    // Handler para envío del formulario - WCAG 3.3.1, 3.3.3
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Validación: Archivo seleccionado
        if (!invoiceFile) {
            setError('Por favor, seleccione una imagen de la factura');
            inputRef.current?.focus();
            return;
        }

        try {
            setIsSubmitting(true);

            // Crear FormData para enviar la imagen
            const formData = new FormData();
            formData.append('invoice', invoiceFile);

            // Enviar imagen al servidor
            await codesService.submitCode(formData);

            // Actualizar datos del usuario para reflejar la nueva factura
            await refreshUser();

            // Mostrar mensaje de éxito
            setSuccessMessage('¡Factura enviada exitosamente!');
            setInvoiceFile(null);
            if (inputRef.current) {
                inputRef.current.value = '';
            }
        } catch (error: unknown) {
            // Manejar errores específicos
            const apiError = error as { status?: number; errors?: Record<string, string[]> };

            if (apiError.status === 422 && apiError.errors) {
                // Error de validación
                const firstError = Object.values(apiError.errors)[0];
                setError(Array.isArray(firstError) ? firstError[0] : 'Error de validación');
            } else if (apiError.status === 400) {
                // Factura ya utilizada
                setError('Esta factura ya fue utilizada anteriormente');
            } else if (apiError.status === 404) {
                // Factura no encontrada
                setError('La factura ingresada no es válida');
            } else {
                // Error genérico
                setError('Ocurrió un error al procesar la factura. Por favor intente nuevamente.');
            }
            inputRef.current?.focus();
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    {/* Formulario de factura - WCAG 3.3.2 */}
                    <section aria-labelledby="invoice-heading">
                        <h1 id="invoice-heading">Subir Factura</h1>

                        {/* WCAG 3.3.1, 3.3.2 - Formulario accesible */}
                        <form
                            onSubmit={handleSubmit}
                            aria-label="Formulario para subir factura"
                            noValidate
                            className='normal'
                            encType="multipart/form-data"
                        >
                            <div className="form-field">
                                <label htmlFor="invoice-file">
                                    <span>Subí la imagen de tu factura:</span>
                                    <span className="required-indicator" aria-label="campo obligatorio">*</span>
                                </label>
                                <input
                                    ref={inputRef}
                                    type="file"
                                    id="invoice-file"
                                    name="invoice"
                                    onChange={handleChange}
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    required
                                    aria-required="true"
                                    aria-invalid={error ? 'true' : 'false'}
                                    aria-describedby={
                                        error
                                            ? 'error-invoice'
                                            : successMessage
                                                ? 'success-invoice'
                                                : 'desc-invoice'
                                    }
                                />

                                {/* Mostrar nombre del archivo seleccionado */}
                                {invoiceFile && (
                                    <p className="selected-file-name" aria-live="polite" style={{
                                        marginTop: "10px"
                                    }}>
                                        Archivo seleccionado: {invoiceFile.name}
                                    </p>
                                )}

                                {/* Descripción del campo - WCAG 3.3.2 */}
                                <span id="desc-invoice" className="visually-hidden">
                                    Seleccione una imagen de su factura en formato JPG, PNG o WEBP. Tamaño máximo: 5MB.
                                </span>

                                {/* WCAG 3.3.1 - Mensaje de error */}
                                {error && (
                                    <span
                                        id="error-invoice"
                                        className="error-message"
                                        role="alert"
                                        aria-live="assertive"
                                    >
                                        {error}
                                    </span>
                                )}

                                {/* WCAG 4.1.3 - Mensaje de éxito */}
                                {successMessage && (
                                    <span
                                        id="success-invoice"
                                        className="success-message"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        {successMessage}
                                    </span>
                                )}
                            </div>

                            {/* WCAG 2.5.3 - Botón de envío */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !invoiceFile}
                                aria-label={isSubmitting ? 'Enviando factura' : 'Enviar factura'}
                                aria-busy={isSubmitting}
                                className='btn-code-v2'
                            >
                                {isSubmitting ? 'Enviando...' : 'Subir Factura'}
                            </button>
                        </form>
                    </section>

                    {/* WCAG 1.1.1 - Imagen decorativa */}
                    <div className="decorative-border" aria-hidden="true"></div>

                    {/* Registro desde otra página - WCAG 2.4.6 */}
                    <section aria-labelledby="no-account-heading" className='already-have-account'>
                        <h4 id="no-account-heading">¿NO TENÉS CUENTA?</h4>
                        <NavLink
                            to="/registrate"
                            aria-label="Ir a página de registro para crear una cuenta nueva"
                            className='btn-accept'
                        >
                            {({ isActive }) => (
                                <span aria-current={isActive ? 'page' : undefined}>
                                    REGISTRATE Y SUBÍ TUS FACTURAS
                                </span>
                            )}
                        </NavLink>
                    </section>
                </div>
            </main>
        </>
    );
};

export default PromotionalCode;