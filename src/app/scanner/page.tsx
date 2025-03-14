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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Ticket Scanner</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
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
