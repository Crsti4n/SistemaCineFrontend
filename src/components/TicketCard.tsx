// src/components/TicketCard.tsx
import QRCode from 'react-qr-code';
import { Download, Share2 } from 'lucide-react';
import { ActiveTicket } from '../data/mocks';

interface TicketCardProps {
  ticket: ActiveTicket;
}

export const TicketCard = ({ ticket }: TicketCardProps) => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden max-w-sm w-full mx-auto my-4">
      <div className="relative">
        <img src={ticket.imagenUrl} alt={`Poster de ${ticket.movieTitle}`} className="w-full h-32 object-cover object-top opacity-30" />
        <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-gray-800 to-transparent">
          <h2 className="text-2xl font-bold text-white">{ticket.movieTitle}</h2>
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold self-start mt-1">
            {ticket.movieFormat}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div>
            <p className="text-sm text-gray-400">Hora</p>
            <p className="text-xl font-bold text-white">{ticket.time}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Sala</p>
            <p className="text-xl font-bold text-white">{ticket.room}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Asientos</p>
            <p className="text-xl font-bold text-white">{ticket.seats.join(', ')}</p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg flex justify-center items-center flex-col">
          <QRCode value={ticket.qrCodeValue} size={160} />
          <p className="text-gray-800 font-mono mt-3 text-sm tracking-widest">{ticket.alphanumericCode}</p>
        </div>
        
        <div className="flex justify-around mt-6">
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <Download className="w-5 h-5" />
            <span className="font-medium">Descargar PDF</span>
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <Share2 className="w-5 h-5" />
            <span className="font-medium">Compartir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
