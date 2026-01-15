import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import type { Code } from '../types/api';

const Profile = () => {
    const { user, isLoading } = useAuth();
    const [showAllCodes, setShowAllCodes] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
    const [invoiceImageUrl, setInvoiceImageUrl] = useState<string | null>(null);
    const [loadingImage, setLoadingImage] = useState(false);

    // Separar nombre y apellido (primera palabra es nombre, resto es apellido)
    const fullName = user?.name || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Formatear fecha en español
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const months = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Datos de facturas del usuario
    const codesData: Code[] = user?.codes || [];

    // Mostrar solo los primeros 3 facturas si no está expandido
    const visibleCodes = showAllCodes ? codesData : codesData.slice(0, 3);
    const remainingCodes = codesData.length - visibleCodes.length;

    // Cargar imagen con token cuando se selecciona una factura
    useEffect(() => {
        if (!selectedInvoice) {
            // Limpiar la imagen anterior
            if (invoiceImageUrl) {
                URL.revokeObjectURL(invoiceImageUrl);
                setInvoiceImageUrl(null);
            }
            return;
        }

        const loadImage = async () => {
            try {
                setLoadingImage(true);
                const token = localStorage.getItem('auth_token');

                const response = await fetch(selectedInvoice, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar la imagen');
                }

                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                setInvoiceImageUrl(blobUrl);
            } catch (error) {
                console.error('Error loading invoice image:', error);
                setInvoiceImageUrl(null);
            } finally {
                setLoadingImage(false);
            }
        };

        loadImage();

        // Cleanup: revocar el blob URL cuando el componente se desmonte o cambie la imagen
        return () => {
            if (invoiceImageUrl) {
                URL.revokeObjectURL(invoiceImageUrl);
            }
        };
    }, [selectedInvoice]);

    if (isLoading) {
        return (
            <main id="main-content" role="main" className='top-space profile-page'>
                <div className='responsive-box'>
                    <p>Cargando perfil...</p>
                </div>
            </main>
        );
    }

    return (
        <>
            {/* SEO Meta Tags */}
            <SEO
                title="Mi Perfil - Lo bueno de cuidarte | Datos y facturas ingresados"
                description="Consultá tu perfil de usuario, revisá tus datos personales y el historial completo de facturas promocionales ingresados en la promoción Lo bueno de cuidarte."
                keywords="perfil usuario Tosh, mi cuenta, facturas ingresados, historial facturas, datos personales, mi perfil Lo bueno de cuidarte"
                ogTitle="Mi Perfil - Lo bueno de cuidarte"
                ogDescription="Accedé a tu perfil y consultá el historial de todos tus facturas ingresados"
                ogUrl="https://chikystrangerthings.com/perfil"
                canonical="https://chikystrangerthings.com/perfil"
                noindex={true}
            />

            {/* WCAG 2.4.1 - Main landmark */}
            <main id="main-content" role="main" aria-labelledby="profile-heading" className='top-space profile-page'>
                <div className='responsive-box'>
                    {/* Sección de información del perfil - WCAG 1.3.1 */}
                    <section aria-labelledby="profile-heading">
                        <h1 id="profile-heading">PERFIL</h1>

                        {/* Descripción oculta - WCAG 2.4.6 */}
                        <p className="visually-hidden">
                            Información personal del usuario registrado en la promoción.
                        </p>

                        {/* Formulario de datos del usuario - WCAG 3.3.2 */}
                        <form
                            aria-label="Información personal del usuario"
                            className="profile-form normal"
                        >
                            <fieldset className='form-row'>
                                <legend className="visually-hidden">Datos personales</legend>

                                {/* Campo nombre - WCAG 4.1.2 */}
                                <div className="form-field">
                                    <label htmlFor="name" id="label-name">
                                        <span>Nombre:</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={firstName}
                                        readOnly
                                        aria-readonly="true"
                                        aria-labelledby="label-name"
                                        aria-describedby="desc-name"
                                        tabIndex={-1}
                                        className="readonly-field"
                                        disabled
                                    />
                                    <span id="desc-name" className="visually-hidden">
                                        Este campo es de solo lectura y no puede ser modificado
                                    </span>
                                </div>

                                {/* Campo apellido - WCAG 4.1.2 */}
                                <div className="form-field">
                                    <label htmlFor="last-name" id="label-last-name">
                                        <span>Apellido:</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="last-name"
                                        name="last-name"
                                        value={lastName}
                                        readOnly
                                        aria-readonly="true"
                                        aria-labelledby="label-last-name"
                                        aria-describedby="desc-last-name"
                                        tabIndex={-1}
                                        className="readonly-field"
                                        disabled
                                    />
                                    <span id="desc-last-name" className="visually-hidden">
                                        Este campo es de solo lectura y no puede ser modificado
                                    </span>
                                </div>
                            </fieldset>
                        </form>
                    </section>

                    {/* Sección de facturas ingresados - WCAG 1.3.1 */}
                    <section aria-labelledby="codes-heading" className='codes'>
                        <h3 id="codes-heading">FACTURAS INGRESADOS</h3>

                        {codesData.length === 0 ? (
                            /* Mensaje cuando no hay facturas - WCAG 1.3.1 */
                            <div className="no-codes-message" role="status" aria-live="polite">
                                <p>No tenés facturas ingresados todavía.</p>
                                <p>¡Empezá a ingresar tus facturas promocionales para participar!</p>
                            </div>
                        ) : (
                            <>
                                {/* Descripción y resumen de la tabla - WCAG 1.3.1 */}
                                <p className="visually-hidden">
                                    Tabla con el historial de facturas promocionales ingresados.
                                    Mostrando {visibleCodes.length} de {codesData.length} facturas.
                                </p>

                                {/* Tabla accesible - WCAG 1.3.1 */}
                                <table
                                    role="table"
                                    aria-label="Historial de facturas promocionales ingresados"
                                    aria-rowcount={codesData.length}
                                    className="codes-table"
                                >
                                    {/* Encabezados de tabla - WCAG 1.3.1 */}
                                    <thead>
                                        <tr role="row">
                                            <th scope="col" role="columnheader" aria-sort="none">
                                                Fecha
                                            </th>
                                            <th scope="col" role="columnheader" aria-sort="none">
                                                N.º
                                            </th>
                                            <th scope="col" role="columnheader" aria-sort="none">
                                                Factura
                                            </th>
                                        </tr>
                                    </thead>

                                    {/* Cuerpo de la tabla - WCAG 1.3.1 */}
                                    <tbody>
                                        {visibleCodes.map((entry, index) => (
                                            <>
                                                <tr
                                                    key={entry.id}
                                                    role="row"
                                                    aria-rowindex={index + 1}
                                                >
                                                    <td role="cell" data-label="Fecha">
                                                        <p>{formatDate(entry.created_at)}</p>
                                                    </td>
                                                    <td role="cell" data-label="N.º" className='number'>
                                                        <p>{index + 1}</p>
                                                    </td>
                                                    <td role="cell" data-label="Factura">
                                                        <button
                                                            type="button"
                                                            onClick={() => setSelectedInvoice(selectedInvoice === entry.invoice_url ? null : entry.invoice_url)}
                                                            className="btn-view-invoice btn-accept"
                                                            aria-label={`Ver factura número ${index + 1}`}
                                                            aria-expanded={selectedInvoice === entry.invoice_url}
                                                        >
                                                            {selectedInvoice === entry.invoice_url ? 'Ocultar' : 'Ver'}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {/* Mostrar imagen debajo de la fila si está seleccionada */}
                                                {selectedInvoice === entry.invoice_url && (
                                                    <tr key={`${entry.id}-image`} className="invoice-row">
                                                        <td colSpan={3} className="invoice-cell">
                                                            <div className="invoice-image-container">
                                                                {loadingImage ? (
                                                                    <div className="loading-invoice">
                                                                        <p>Cargando imagen...</p>
                                                                    </div>
                                                                ) : invoiceImageUrl ? (
                                                                    <img
                                                                        src={invoiceImageUrl}
                                                                        alt={`Factura número ${index + 1}`}
                                                                        className="invoice-image"
                                                                    />
                                                                ) : (
                                                                    <div className="error-loading-invoice">
                                                                        <p>Error al cargar la imagen</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        ))}
                                    </tbody>

                                    {/* Caption oculto de la tabla - WCAG 1.3.1 */}
                                    <caption className="visually-hidden">
                                        Historial de {codesData.length} facturas promocionales ingresados por el usuario
                                    </caption>
                                </table>

                                {/* Botón ver más/menos - WCAG 2.5.3, 4.1.2 */}
                                {codesData.length > 3 && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAllCodes(!showAllCodes)}
                                        aria-expanded={showAllCodes}
                                        aria-controls="codes-table"
                                        aria-label={
                                            showAllCodes
                                                ? 'Ver menos facturas'
                                                : `Ver todos los ${codesData.length} facturas (${remainingCodes} más)`
                                        }
                                        className="toggle-button btn-code"
                                    >
                                        {showAllCodes ? 'Ver menos' : `Ver más`}
                                        <span className="visually-hidden">
                                            {showAllCodes
                                                ? ` Mostrando todos los ${codesData.length} facturas`
                                                : ` Mostrando ${visibleCodes.length} de ${codesData.length} facturas`
                                            }
                                        </span>
                                    </button>
                                )}

                                {/* Anuncio de cambio para lectores de pantalla - WCAG 4.1.3 */}
                                <div
                                    className="visually-hidden"
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {showAllCodes && (
                                        <span>Mostrando todos los {codesData.length} facturas</span>
                                    )}
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
};

export default Profile;