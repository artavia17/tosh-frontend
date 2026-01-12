import { useState, useEffect, useRef } from 'react';
import SEO from '../components/SEO';
import countriesService from '../services/countries.service';
import winnersService from '../services/winners.service';
import type { Country, WinnerPeriod } from '../types/api';

const Winners = () => {
    // Estado para el modal de selección de país
    const [isCountryModalOpen, setIsCountryModalOpen] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);

    // Estado para ganadores
    const [winners, setWinners] = useState<WinnerPeriod[]>([]);
    const [isLoadingWinners, setIsLoadingWinners] = useState(false);

    // Referencias para el modal
    const countryModalRef = useRef<HTMLDivElement>(null);
    const countrySelectRef = useRef<HTMLSelectElement>(null);

    // Formatear período de fechas - WCAG 1.3.1
    const formatPeriod = (startDate: string, endDate: string): string => {
        const months = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];

        const start = new Date(startDate);
        const end = new Date(endDate);

        const startDay = start.getDate();
        const endDay = end.getDate();
        const month = months[end.getMonth()];
        const year = end.getFullYear();

        return `${startDay.toString().padStart(2, '0')} al ${endDay.toString().padStart(2, '0')} ${month} ${year}`;
    };

    // Cargar países al montar el componente
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setIsLoadingCountries(true);
                const response = await countriesService.getCountries();

                if (response && response.data && Array.isArray(response.data)) {
                    setCountries(response.data);

                    // Verificar si hay un país guardado en localStorage
                    const savedCountryId = localStorage.getItem('selectedCountryId');
                    if (savedCountryId) {
                        const country = response.data.find(c => c.id === parseInt(savedCountryId));
                        if (country) {
                            setSelectedCountry(country);
                            setIsCountryModalOpen(false);
                            // Cargar ganadores del país guardado
                            loadWinners(country.id);
                        }
                    }
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

    // Función para cargar ganadores
    const loadWinners = async (countryId: number) => {
        try {
            setIsLoadingWinners(true);
            const response = await winnersService.getWinners(countryId);

            if (response && response.data && Array.isArray(response.data)) {
                setWinners(response.data);
            } else {
                setWinners([]);
            }
        } catch (error) {
            console.error('Error loading winners:', error);
            setWinners([]);
        } finally {
            setIsLoadingWinners(false);
        }
    };

    // Handler para confirmar país
    const handleCountryConfirm = () => {
        if (selectedCountry) {
            setIsCountryModalOpen(false);
            // Guardar la selección en localStorage
            localStorage.setItem('selectedCountryId', selectedCountry.id.toString());
            // Cargar ganadores del país seleccionado
            loadWinners(selectedCountry.id);
        }
    };

    // Prevenir scroll cuando el modal está abierto - WCAG 2.4.3
    useEffect(() => {
        if (isCountryModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isCountryModalOpen]);

    // Focus trap en el modal - WCAG 2.4.3
    useEffect(() => {
        if (!isCountryModalOpen || !countryModalRef.current) return;

        const focusableElements = countryModalRef.current.querySelectorAll(
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
        countrySelectRef.current?.focus();

        return () => document.removeEventListener('keydown', handleTabKey);
    }, [isCountryModalOpen]);

    // Handler para cambiar país
    const handleChangeCountry = () => {
        setIsCountryModalOpen(true);
    };

    return (
        <>
            {/* SEO Meta Tags */}
            <SEO
                title="Ganadores - Chiky Stranger Things | Lista de ganadores oficiales"
                description="Conocé la lista oficial de ganadores de la promoción Chiky Stranger Things. Consultá los sorteos por período y descubrí si ganaste uno de los increíbles premios."
                keywords="ganadores Chiky, lista ganadores, sorteos Chiky, ganadores Stranger Things, resultados sorteo, premios ganados"
                ogTitle="Lista de Ganadores - Chiky Stranger Things"
                ogDescription="Consultá la lista oficial de ganadores de cada período de la promoción Chiky Stranger Things"
                ogUrl="https://chikystrangerthings.com/ganadores"
                canonical="https://chikystrangerthings.com/ganadores"
            />

            {/* WCAG 2.4.1 - Main landmark */}
            <main id="main-content" role="main" aria-labelledby="winners-heading" className='top-space winners-page'>

                <div className='responsive-box'>
                    {/* Sección principal de ganadores - WCAG 1.3.1 */}
                    <section aria-labelledby="winners-heading">
                        <h1 id="winners-heading">GANADORES</h1>

                        {/* Descripción oculta para lectores de pantalla - WCAG 2.4.6 */}
                        <p className="visually-hidden">
                            Lista de ganadores organizados por períodos de la promoción.
                            Cada período muestra los ganadores del sorteo correspondiente.
                        </p>

                        {/* Indicador de carga */}
                        {isLoadingWinners && (
                            <div className="loading-message" role="status" aria-live="polite">
                                <p>Cargando ganadores...</p>
                            </div>
                        )}

                        {/* Mensaje cuando no hay ganadores */}
                        {!isLoadingWinners && winners.length === 0 && !isCountryModalOpen && (
                            <div className="no-winners-message" role="status" aria-live="polite">
                                <p>Aún no se han seleccionado ganadores para este país.</p>
                                <p>Revisá esta página próximamente para ver los resultados.</p>
                            </div>
                        )}

                        {/* Lista de períodos - WCAG 1.3.1 */}
                        {!isLoadingWinners && winners.length > 0 && (
                            <>
                                {/* Botón para cambiar país */}
                                <div className="change-country-section">
                                    <button
                                        type="button"
                                        onClick={handleChangeCountry}
                                        aria-label="Cambiar país seleccionado"
                                        className="btn-code"
                                    >
                                        Cambiar país
                                    </button>
                                </div>

                                <div role="region" aria-label="Períodos de sorteos y ganadores">
                                    {winners.map((period: WinnerPeriod, index: number) => {
                                        const periodLabel = formatPeriod(period.start_date, period.end_date);

                                        return (
                                            <article
                                                key={index}
                                                aria-labelledby={`period-heading-${index}`}
                                                className="winners-period"
                                            >
                                                <div>
                                                    {/* Título del período - WCAG 2.4.6 */}
                                                    <p id={`period-heading-${index}`} className='title'>
                                                        {periodLabel}
                                                    </p>

                                                    {/* Lista de ganadores - WCAG 1.3.1 */}
                                                    <ul
                                                        id={`winners-list-${index}`}
                                                        role="list"
                                                        aria-label={`Ganadores del período ${periodLabel}`}
                                                        className='expanded'
                                                    >
                                                        {period.winners.map((winner, wIndex) => (
                                                            <li
                                                                key={winner.id}
                                                                role="listitem"
                                                            >
                                                                <strong>Ganador {wIndex + 1}</strong>{' '}
                                                                <p>
                                                                    <span className="winner-name">{winner.user.name}</span>
                                                                </p>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </main>

            {/* Modal de selección de país - WCAG 2.4.3, 4.1.2 */}
            {isCountryModalOpen && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="country-modal-title"
                    aria-describedby="country-modal-description"
                    className="modal-overlay country-modal-overlay"
                    ref={countryModalRef}
                >
                    <div className="modal-content country-modal-content" role="document">
                        {/* Título del modal - WCAG 2.4.6 */}
                        <h2 id="country-modal-title">
                            Seleccioná tu país
                        </h2>

                        {/* Descripción - WCAG 1.3.1 */}
                        <p id="country-modal-description">
                            Para mostrar los ganadores correspondientes a su región, por favor seleccione su país:
                        </p>

                        {/* Formulario de selección - WCAG 3.3.2 */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleCountryConfirm();
                            }}
                            aria-label="Formulario de selección de país"
                            className='normal'
                        >
                            <div className="form-field">
                                <label htmlFor="country-select">
                                    <span>País:</span>
                                    <span className="required-indicator" aria-label="campo obligatorio">*</span>
                                </label>
                                <select
                                    ref={countrySelectRef}
                                    id="country-select"
                                    name="country"
                                    value={selectedCountry?.id || ''}
                                    onChange={(e) => {
                                        const countryId = parseInt(e.target.value);
                                        const country = countries.find(c => c.id === countryId);
                                        setSelectedCountry(country || null);
                                    }}
                                    required
                                    aria-required="true"
                                    aria-describedby="desc-country-select"
                                    autoFocus
                                    disabled={isLoadingCountries}
                                >
                                    <option value="">
                                        {isLoadingCountries ? 'Cargando países...' : 'Seleccione un país'}
                                    </option>
                                    {countries && countries.length > 0 && countries.map((country) => (
                                        <option key={country.id} value={country.id}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                                <span id="desc-country-select" className="visually-hidden">
                                    Seleccione el país desde el cual está participando en la promoción
                                </span>
                            </div>

                            {/* Botón de confirmación - WCAG 2.5.3 */}
                            <button
                                type="submit"
                                disabled={!selectedCountry}
                                aria-label={selectedCountry ? 'Confirmar país seleccionado' : 'Seleccione un país para continuar'}
                                className="btn-accept"
                            >
                                Confirmar
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Winners;