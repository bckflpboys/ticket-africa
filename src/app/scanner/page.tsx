'use client';

import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/toast';
import Navbar from '@/components/layout/Navbar';

interface ScanResult {
  eventId: string;
  ticketType: string;
  scannedAt: string;
  scannedBy: string;
}

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    let scanner: any = null;

    if (!scanner) {
      scanner = new Html5QrcodeScanner('reader', {
        qrbox: { width: 250, height: 250 },
        fps: 5,
      }, false);

      scanner.render(onScanSuccess, onScanError);

      // Add custom styles to the scanner buttons
      const style = document.createElement('style');
      style.textContent = `
        #reader__dashboard_section_csr button {
          background-color: #4F46E5 !important;
          color: white !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          border: none !important;
          font-weight: 500 !important;
          margin: 4px !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
        }
        #reader__dashboard_section_csr button:hover {
          background-color: #4338CA !important;
        }
        #reader__dashboard_section_csr button:active {
          transform: scale(0.98) !important;
        }
        #reader__dashboard_section_csr {
          margin-bottom: 16px !important;
          text-align: center !important;
        }
        #reader__dashboard_section_swaplink {
          color: #4F46E5 !important;
          text-decoration: underline !important;
          margin: 8px 0 !important;
          display: inline-block !important;
        }
        #reader__scan_region {
          border: 2px solid #E5E7EB !important;
          border-radius: 8px !important;
          overflow: hidden !important;
        }
        #reader__header_message {
          color: #374151 !important;
          font-size: 0.875rem !important;
          margin: 8px 0 !important;
        }
        select {
          padding: 6px 12px !important;
          border-radius: 6px !important;
          border: 1px solid #D1D5DB !important;
          margin: 8px !important;
          background-color: white !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [status]);

  const onScanSuccess = async (decodedText: string) => {
    try {
      const response = await fetch('/api/tickets/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId: decodedText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      showToast('Ticket successfully scanned!', 'success');
      setScanResult(data.ticketDetails);
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const onScanError = (error: any) => {
    console.warn(error);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Ticket Scanner</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <div className="mb-4 text-sm text-gray-600 text-center">
            <p>Position the QR code within the frame to scan</p>
          </div>
          
          <div id="reader" className="mb-6"></div>
          
          {scanResult && (
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold mb-4">Scan Result</h2>
              <div className="space-y-2">
                <p><strong>Event ID:</strong> {scanResult.eventId}</p>
                <p><strong>Ticket Type:</strong> {scanResult.ticketType}</p>
                <p><strong>Scanned At:</strong> {new Date(scanResult.scannedAt).toLocaleString()}</p>
                <p><strong>Scanned By:</strong> {scanResult.scannedBy}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
