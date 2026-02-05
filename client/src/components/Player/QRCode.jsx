// QR Code component

import { QRCodeSVG } from 'qrcode.react';
import './QRCode.css';

export function QRCode() {
    // Get the controller URL based on current location
    const getControllerUrl = () => {
        const { protocol, host } = window.location;
        return `${protocol}//${host}/controller`;
    };

    return (
        <div className="qr-section">
            <div className="qr-container">
                <QRCodeSVG
                    value={getControllerUrl()}
                    size={160}
                    bgColor="transparent"
                    fgColor="#ffffff"
                    level="M"
                    includeMargin={false}
                />
            </div>
            <div className="qr-info">
                <p className="qr-label">Scan to control</p>
                <p className="qr-url">/controller</p>
            </div>
        </div>
    );
}
