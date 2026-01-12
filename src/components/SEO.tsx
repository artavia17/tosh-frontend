import { useEffect } from 'react';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    canonical?: string;
    noindex?: boolean;
}

/**
 * Componente SEO para gestionar metadatos de cada página
 * Implementa mejores prácticas de SEO y Open Graph
 */
const SEO = ({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage = 'https://chikystrangerthings.com/og-image.jpg',
    ogUrl,
    canonical,
    noindex = false
}: SEOProps) => {
    useEffect(() => {
        // Actualizar título de la página
        document.title = title;

        // Helper para actualizar o crear meta tags
        const setMetaTag = (name: string, content: string, isProperty = false) => {
            const attribute = isProperty ? 'property' : 'name';
            let element = document.querySelector(`meta[${attribute}="${name}"]`);

            if (!element) {
                element = document.createElement('meta');
                element.setAttribute(attribute, name);
                document.head.appendChild(element);
            }

            element.setAttribute('content', content);
        };

        // Meta tags básicos
        setMetaTag('description', description);

        if (keywords) {
            setMetaTag('keywords', keywords);
        }

        // Robots
        if (noindex) {
            setMetaTag('robots', 'noindex, nofollow');
        } else {
            setMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large');
        }

        // Open Graph / Facebook
        setMetaTag('og:title', ogTitle || title, true);
        setMetaTag('og:description', ogDescription || description, true);
        setMetaTag('og:image', ogImage, true);
        setMetaTag('og:type', 'website', true);
        setMetaTag('og:locale', 'es_AR', true);

        if (ogUrl) {
            setMetaTag('og:url', ogUrl, true);
        }

        // Twitter Card
        setMetaTag('twitter:card', 'summary_large_image');
        setMetaTag('twitter:title', ogTitle || title);
        setMetaTag('twitter:description', ogDescription || description);
        setMetaTag('twitter:image', ogImage);

        // Canonical URL
        if (canonical) {
            let linkElement = document.querySelector('link[rel="canonical"]');

            if (!linkElement) {
                linkElement = document.createElement('link');
                linkElement.setAttribute('rel', 'canonical');
                document.head.appendChild(linkElement);
            }

            linkElement.setAttribute('href', canonical);
        }
    }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, canonical, noindex]);

    return null; // Este componente no renderiza nada
};

export default SEO;
