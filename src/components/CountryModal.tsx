import { useEffect, useRef } from 'react';
import { useCountry } from '../context/CountryContext';

const CountryModal = () => {
    const {
        selectedCountry,
        countries,
        isLoadingCountries,
        setSelectedCountry,
        isCountryModalOpen,
        setIsCountryModalOpen,
    } = useCountry();

    const countryModalRef = useRef<HTMLDivElement>(null);
    const countrySelectRef = useRef<HTMLSelectElement>(null);

    // Handler para confirmar país
    const handleCountryConfirm = () => {
        if (selectedCountry) {
            setIsCountryModalOpen(false);
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

    if (!isCountryModalOpen) return null;

    return (
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
                    Para mostrar el contenido correspondiente a tu región, por favor seleccioná tu país:
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
                            style={{
                                border: "2px solid #548039",
                                color: "#548039"
                            }}
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
    );
};

export default CountryModal;
