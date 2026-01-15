import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import countriesService from '../services/countries.service';
import type { Country } from '../types/api';

interface CountryContextType {
    selectedCountry: Country | null;
    countries: Country[];
    isLoadingCountries: boolean;
    setSelectedCountry: (country: Country | null) => void;
    isCountryModalOpen: boolean;
    setIsCountryModalOpen: (isOpen: boolean) => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider = ({ children }: { children: ReactNode }) => {
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
    const [countries, setCountries] = useState<Country[]>([]);
    const [isLoadingCountries, setIsLoadingCountries] = useState(true);
    const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);

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
                        } else {
                            // Si no hay país guardado válido, abrir modal
                            setIsCountryModalOpen(true);
                        }
                    } else {
                        // Si no hay país guardado, abrir modal
                        setIsCountryModalOpen(true);
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

    // Guardar país seleccionado en localStorage cuando cambia
    useEffect(() => {
        if (selectedCountry) {
            localStorage.setItem('selectedCountryId', selectedCountry.id.toString());
        }
    }, [selectedCountry]);

    const value = {
        selectedCountry,
        countries,
        isLoadingCountries,
        setSelectedCountry,
        isCountryModalOpen,
        setIsCountryModalOpen,
    };

    return (
        <CountryContext.Provider value={value}>
            {children}
        </CountryContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCountry = () => {
    const context = useContext(CountryContext);
    if (context === undefined) {
        throw new Error('useCountry must be used within a CountryProvider');
    }
    return context;
};
