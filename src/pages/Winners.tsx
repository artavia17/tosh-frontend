import { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import winnersService from '../services/winners.service';
import { useCountry } from '../context/CountryContext';
import type { WinnerPeriod } from '../types/api';
import VasoImg from '../assets/img/png/vaso.png';
import PapasImg from '../assets/img/png/papas.png';

const Winners = () => {
    const { selectedCountry, setIsCountryModalOpen } = useCountry();

    // Estado para ganadores
    const [winners, setWinners] = useState<WinnerPeriod[]>([]);
    const [isLoadingWinners, setIsLoadingWinners] = useState(false);

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

    // Cargar ganadores cuando cambia el país seleccionado
    useEffect(() => {
        if (selectedCountry) {
            loadWinners(selectedCountry.id);
        }
    }, [selectedCountry]);

    // Handler para cambiar país
    const handleChangeCountry = () => {
        setIsCountryModalOpen(true);
    };

    return (
        <>
            {/* SEO Meta Tags */}
            <SEO
                title="Ganadores - Lo bueno de cuidarte | Lista de ganadores oficiales"
                description="Conocé la lista oficial de ganadores de la promoción Lo bueno de cuidarte. Consultá los sorteos por período y descubrí si ganaste uno de los increíbles premios."
                keywords="ganadores Tosh, lista ganadores, sorteos Tosh, ganadores Lo bueno de cuidarte, resultados sorteo, premios ganados"
                ogTitle="Lista de Ganadores - Lo bueno de cuidarte"
                ogDescription="Consultá la lista oficial de ganadores de cada período de la promoción Lo bueno de cuidarte"
                ogUrl="https://chikystrangerthings.com/ganadores"
                canonical="https://chikystrangerthings.com/ganadores"
            />

            <img
                src={VasoImg}
                alt="Vaso Tosh"
                loading="lazy"
                className="top-left-absolute"
            />

            <img
                src={PapasImg}
                alt="Vaso Tosh"
                loading="lazy"
                className="bottom-right-absolute"
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
                        {!isLoadingWinners && winners.length === 0 && selectedCountry && (
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
        </>
    );
};

export default Winners;