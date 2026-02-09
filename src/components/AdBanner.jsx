import React, { useEffect, useRef } from 'react';

const AdBanner = () => {
    const bannerRef = useRef(null);

    useEffect(() => {
        const container = bannerRef.current;
        if (!container) return;

        // Create an iframe to isolate the ad script
        const iframe = document.createElement('iframe');

        // Style the iframe to fit the container without borders/scrollbars
        iframe.style.width = '320px';
        iframe.style.height = '50px';
        iframe.style.border = 'none';
        iframe.style.overflow = 'hidden';
        iframe.scrolling = 'no';

        // Clear container and append iframe
        container.innerHTML = '';
        container.appendChild(iframe);

        // Write the ad script into the iframe
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <style>body { margin: 0; padding: 0; overflow: hidden; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
            </head>
            <body>
                <script type="text/javascript">
                    atOptions = {
                        'key' : '8af8f013031d0daca6466458e103a0a3',
                        'format' : 'iframe',
                        'height' : 50,
                        'width' : 320,
                        'params' : {}
                    };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/8af8f013031d0daca6466458e103a0a3/invoke.js"></script>
            </body>
            </html>
        `);
        doc.close();

        return () => {
            if (container) {
                container.innerHTML = '';
            }
        };
    }, []);

    return (
        <div
            ref={bannerRef}
            className="ad-banner-container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '20px auto',
                width: '320px',
                height: '50px',
                background: 'rgba(255, 255, 255, 0.02)', // Placeholder background
                borderRadius: '8px',
                overflow: 'hidden'
            }}
        >
        </div>
    );
};

export default AdBanner;
