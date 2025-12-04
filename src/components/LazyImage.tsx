import { useState, useEffect, useRef } from 'react';
import { Skeleton } from './ui/skeleton';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    aspectRatio?: string;
}

export function LazyImage({ src, alt, className = '', aspectRatio = 'aspect-square' }: LazyImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(true); // Changed to true to disable lazy loading
    const imgRef = useRef<HTMLDivElement>(null);

    // IntersectionObserver removed - images now load immediately for better UX

    return (
        <div ref={imgRef} className={`${aspectRatio} relative overflow-hidden ${className}`}>
            {!isLoaded && <Skeleton className="absolute inset-0" />}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    onLoad={() => setIsLoaded(true)}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            )}
        </div>
    );
}
