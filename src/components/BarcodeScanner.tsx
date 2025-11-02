import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './BarcodeScanner.css';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner = ({ onScan, onClose }: BarcodeScannerProps) => {
  const [error, setError] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanning = useRef(false);

  useEffect(() => {
    const startScanner = async () => {
      if (isScanning.current) return;
      
      try {
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;
        isScanning.current = true;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            onScan(decodedText);
            stopScanner();
          },
          () => {
            // Ignorer les erreurs de scan normales
          }
        );
      } catch (err) {
        setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
        console.error('Erreur scanner:', err);
      }
    };

    const stopScanner = async () => {
      if (scannerRef.current && isScanning.current) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
          isScanning.current = false;
        } catch (err) {
          console.error('Erreur lors de l\'arrêt du scanner:', err);
        }
      }
    };

    startScanner();

    return () => {
      stopScanner();
    };
  }, [onScan]);

  return (
    <div className="scanner-overlay">
      <div className="scanner-container">
        <div className="scanner-header">
          <h2>Scanner un code-barres</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div id="reader" className="scanner-viewport"></div>
        {error && <div className="scanner-error">{error}</div>}
        <p className="scanner-instructions">
          Positionnez le code-barres dans le cadre
        </p>
      </div>
    </div>
  );
};

export default BarcodeScanner;
