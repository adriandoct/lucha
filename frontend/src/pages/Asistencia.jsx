import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Asistencia() {
  const [qrValue, setQrValue] = useState('session-12345');
  const [scanned, setScanned] = useState(false);

  // Simulate QR dynamic refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setQrValue(`session-${Date.now()}`);
    }, 30000); // refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-black uppercase italic mb-8">Control de Asistencia</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* QR Code Section */}
        <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-[80px]"></div>
          
          <h2 className="text-2xl font-bold mb-2">Escanea para Asistir</h2>
          <p className="text-gray-400 mb-8 text-center max-w-sm">
            Los estudiantes deben escanear este código con su aplicación para registrar su asistencia a la clase actual.
          </p>

          <div className="bg-white p-6 rounded-2xl shadow-[0_0_40px_rgba(220,38,38,0.3)] mb-6 transform transition-transform hover:scale-105">
            <QRCodeSVG 
              value={qrValue} 
              size={250} 
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={false}
            />
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>El código se actualiza automáticamente cada 30 segundos</span>
          </div>
        </div>

        {/* Recent Scans */}
        <div className="w-full lg:w-1/3 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-bold mb-6">Asistencias Recientes</h2>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 bg-gray-950 p-4 rounded-xl border border-gray-800">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg"></div>
                <div>
                  <div className="font-bold text-gray-100">Estudiante {i + 1}</div>
                  <div className="text-xs text-green-500 font-medium">Asistencia registrada</div>
                </div>
                <div className="ml-auto text-xs text-gray-500">
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
