"use client";

import { useEffect, useRef } from 'react';

// Extend window object to include Pannellum's global viewer function
declare global {
  interface Window {
    pannellum: any;
  }
}

export default function PanoramaViewer({ imagePath }: { imagePath: string }) {
    const viewerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Dynamically load Pannellum's CSS
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
        document.head.appendChild(style);

        // Dynamically load Pannellum's JavaScript library
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
        script.onload = () => {
            if (window.pannellum && viewerRef.current) {
                window.pannellum.viewer(viewerRef.current.id, {
                    "type": "equirectangular",
                    "panorama": imagePath,
                    "autoLoad": true,
                    "autoRotate": -2
                });
            }
        };
        document.head.appendChild(script);

        // Cleanup function to remove the added elements if the component unmounts
        return () => {
            document.head.removeChild(script);
            document.head.removeChild(style);
        };
    }, [imagePath]);

    return (
        <div 
            id="panorama-viewer" 
            ref={viewerRef} 
            style={{ width: '100%', height: '500px' }} 
        />
    );
}
