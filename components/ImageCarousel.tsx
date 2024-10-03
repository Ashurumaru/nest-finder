// components/ImageCarousel.tsx

import React from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

interface ImageCarouselProps {
    images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    const galleryItems = images.map((image) => ({
        original: image,
        thumbnail: image,
    }));

    return (
        <div className="w-full">
            <ImageGallery
                items={galleryItems}
                showThumbnails={true}
                showFullscreenButton={true}
                showPlayButton={false}
                showNav={true}
                lazyLoad={true}
                useBrowserFullscreen={false}
            />
        </div>
    );
};

export default ImageCarousel;
