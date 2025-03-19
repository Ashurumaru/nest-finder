import React from 'react';
import ReactDOM from 'react-dom';

// Types for Yandex Maps components
declare global {
    interface Window {
        ymaps3: any;
    }
}

// This function will be used to initialize React components for Yandex Maps
export async function initYmapsReact() {
    // Wait for ymaps to load
    await window.ymaps3.ready;

    // Import reactify module
    const ymaps3Reactify = await window.ymaps3.import('@yandex/ymaps3-reactify');

    // Bind React to ymaps
    const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM);

    // Return React components
    return {
        reactify,
        YMap: reactify.module(window.ymaps3).YMap,
        YMapDefaultSchemeLayer: reactify.module(window.ymaps3).YMapDefaultSchemeLayer,
        YMapDefaultFeaturesLayer: reactify.module(window.ymaps3).YMapDefaultFeaturesLayer,
        YMapMarker: reactify.module(window.ymaps3).YMapMarker,
        YMapObjectManager: reactify.module(window.ymaps3).YMapObjectManager,
        YMapControls: reactify.module(window.ymaps3).YMapControls,
        YMapZoomControl: reactify.module(window.ymaps3).YMapZoomControl,
    };
}