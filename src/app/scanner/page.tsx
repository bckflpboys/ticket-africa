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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Scan Ticket</h1>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Scanner Section */}
              <div className="p-4 sm:p-6">
                <div className="aspect-square max-w-md mx-auto relative">
                  <div id="reader" className="w-full h-full"></div>
                </div>
                <p className="text-sm text-gray-500 text-center mt-4">
                  Position the QR code within the frame to scan
                </p>
              </div>

              {/* Results Section */}
              {scanResult && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 sm:p-6">
                  <h2 className="text-lg font-semibold mb-4 text-center">Ticket Details</h2>
                  <div className="grid gap-4 max-w-sm mx-auto">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-500">Event ID</p>
                      <p className="font-medium">{scanResult.eventId}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-500">Ticket Type</p>
                      <p className="font-medium">{scanResult.ticketType}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-500">Scanned At</p>
                      <p className="font-medium">{new Date(scanResult.scannedAt).toLocaleString()}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-sm text-gray-500">Scanned By</p>
                      <p className="font-medium">{scanResult.scannedBy}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Make sure the QR code is well-lit and clearly visible</p>
              <p>Hold your device steady while scanning</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
