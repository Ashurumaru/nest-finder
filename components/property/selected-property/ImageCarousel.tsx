//components/property/selected-property/ImageCarousel.tsx
"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import "react-image-gallery/styles/css/image-gallery.css";
import { cn } from "@/lib/utils";

const ImageGallery = dynamic(() => import("react-image-gallery"), { ssr: false });

interface ImageCarouselProps {
    images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const galleryItems = images.map((image) => ({
        original: image,
        thumbnail: image,
        originalAlt: "Изображение недвижимости",
        thumbnailAlt: "Миниатюра изображения недвижимости",
    }));

    // Пользовательские стили для переопределения стилей галереи
    const customGalleryClassName = cn(
        isFullscreen ? "fullscreen-gallery" : "standard-gallery"
    );

    return (
        <div className="w-full relative">
            <style jsx global>{`
                .standard-gallery .image-gallery-slide img {
                    max-height: 65vh;
                    object-fit: cover;
                }
                
                .image-gallery-thumbnails-container {
                    background-color: rgba(249, 250, 251);
                    padding: 10px 0;
                    border-top: 1px solid rgba(229, 231, 235);
                }
                
                .image-gallery-thumbnail.active, 
                .image-gallery-thumbnail:focus {
                    border: 2px solid #2363eb !important;
                }
                
                .image-gallery-left-nav,
                .image-gallery-right-nav {
                    border-radius: 50%;
                    padding: 12px 8px;
                    transition: all 0.2s ease-in-out;
                }
                
                .image-gallery-left-nav:hover,
                .image-gallery-right-nav:hover {
                    color: #2363eb;
                }
                
                .image-gallery-fullscreen-button {
                    border-radius: 50%;
                    padding: 10px;
                    transition: all 0.2s ease-in-out;
                }
                
                .image-gallery-fullscreen-button:hover {
                    color: #2363eb;
                }
            `}</style>

            <ImageGallery
                items={galleryItems}
                showThumbnails={true}
                showFullscreenButton={true}
                showPlayButton={false}
                showNav={true}
                lazyLoad={true}
                useBrowserFullscreen={true}
                additionalClass={customGalleryClassName}
                onScreenChange={(fullscreen) => setIsFullscreen(fullscreen)}
                slideInterval={5000}
                thumbnailPosition="bottom"
            />
        </div>
    );
};

export default ImageCarousel;