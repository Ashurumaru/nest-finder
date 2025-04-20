import React from 'react';
import ReactDOM from 'react-dom';

declare global {
    interface Window {
        ymaps3: any;
    }
}
export async function initYmapsReact() {
    await window.ymaps3.ready;
    const ymaps3Reactify = await window.ymaps3.import('@yandex/ymaps3-reactify');
    const reactify = ymaps3Reactify.reactify.bindTo(React, ReactDOM);
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