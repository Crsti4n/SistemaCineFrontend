import { useState, useEffect } from 'react';
import { butacasService } from '../api/services';
import type { Butaca, EstadoButaca } from '../types';
import { Loader2, X, Info } from 'lucide-react';

interface SeatSelectorProps {
    funcionId: number;
    salaId: number;
    maxSeats: number;
    selectedSeats: Butaca[];
    onSeatsChange: (seats: Butaca[]) => void;
}

export const SeatSelector = ({ funcionId, salaId, maxSeats, selectedSeats, onSeatsChange }: SeatSelectorProps) => {
    const [butacas, setButacas] = useState<Butaca[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({ disponibles: 0, bloqueadas: 0, vendidas: 0 });

    useEffect(() => {
        console.log('🎬 SeatSelector montado - funcionId:', funcionId);

        const loadButacas = async () => {
            try {
                console.log('📡 Iniciando carga de butacas...');
                setLoading(true);
                setError(null);
                const response = await butacasService.getDisponiblesByFuncion(funcionId);
                console.log('✅ Respuesta del backend:', response);
                console.log('📊 Butacas recibidas:', response.butacas?.length || 0);

                setButacas(response.butacas);
                setStats({
                    disponibles: response.disponibles,
                    bloqueadas: response.bloqueadas,
                    vendidas: response.vendidas
                });
            } catch (err: any) {
                console.error('❌ Error al cargar butacas:', err);
                console.error('❌ Error response:', err.response);
                setError('Error al cargar los asientos. Por favor, intenta de nuevo.');
                setButacas([]);
            } finally {
                setLoading(false);
                console.log('🏁 Carga finalizada');
            }
        };

        loadButacas();
    }, [funcionId]);

    const handleSeatClick = (butaca: Butaca) => {
        // Solo permitir seleccionar asientos DISPONIBLES
        if (butaca.estado !== 'DISPONIBLE') return;

        const isSelected = selectedSeats.some(s => s.id === butaca.id);

        if (isSelected) {
            // Deseleccionar
            onSeatsChange(selectedSeats.filter(s => s.id !== butaca.id));
        } else {
            // Seleccionar
            if (selectedSeats.length >= maxSeats) {
                alert(`Solo puedes seleccionar ${maxSeats} asiento(s)`);
                return;
            }
            onSeatsChange([...selectedSeats, butaca]);
        }
    };

    const getSeatStyle = (butaca: Butaca): string => {
        const isSelected = selectedSeats.some(s => s.id === butaca.id);

        if (isSelected) {
            return 'bg-blue-600 hover:bg-blue-700 text-white border-blue-400 cursor-pointer';
        }

        switch (butaca.estado) {
            case 'DISPONIBLE':
                return 'bg-gray-600 hover:bg-green-500 text-white border-gray-500 hover:border-green-400 cursor-pointer';
            case 'BLOQUEADA':
                return 'bg-yellow-600 cursor-not-allowed opacity-70 border-yellow-500';
            case 'VENDIDA':
                return 'bg-red-600 cursor-not-allowed opacity-60 border-red-500';
            default:
                return 'bg-gray-700 cursor-not-allowed border-gray-600';
        }
    };

    const getSeatTooltip = (butaca: Butaca): string => {
        const baseInfo = `${butaca.identificador}`;
        switch (butaca.estado) {
            case 'DISPONIBLE':
                return `${baseInfo} - Disponible`;
            case 'BLOQUEADA':
                return `${baseInfo} - Bloqueado por otro usuario`;
            case 'VENDIDA':
                return `${baseInfo} - Ya vendido`;
            default:
                return baseInfo;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-400">Cargando asientos...</span>
            </div>
        );
    }

    if (error || butacas.length === 0) {
        return (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6 text-center">
                <p className="text-red-300">{error || 'No hay asientos disponibles'}</p>
            </div>
        );
    }

    // Agrupar butacas por fila
    const butacasPorFila = butacas.reduce((acc, butaca) => {
        if (!acc[butaca.fila]) {
            acc[butaca.fila] = [];
        }
        acc[butaca.fila].push(butaca);
        return acc;
    }, {} as Record<string, Butaca[]>);

    // Ordenar filas alfabéticamente
    const filasOrdenadas = Object.keys(butacasPorFila).sort();

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Selecciona tus Asientos</h3>

            {/* Estadísticas */}
            <div className="flex justify-center gap-6 mb-6 p-4 bg-gray-900/50 rounded-lg">
                <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.disponibles}</div>
                    <div className="text-xs text-gray-400">Disponibles</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{stats.bloqueadas}</div>
                    <div className="text-xs text-gray-400">Bloqueados</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{stats.vendidas}</div>
                    <div className="text-xs text-gray-400">Vendidos</div>
                </div>
            </div>

            {/* Info sobre butacas bloqueadas */}
            {stats.bloqueadas > 0 && (
                <div className="mb-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3 flex items-start gap-2">
                    <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-yellow-300 text-sm">
                        Los asientos amarillos están temporalmente bloqueados por otros usuarios.
                        Se liberarán automáticamente si no completan la compra en 10 minutos.
                    </p>
                </div>
            )}

            {/* Pantalla */}
            <div className="mb-8">
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 h-3 rounded-t-full mx-auto max-w-3xl shadow-lg"></div>
                <p className="text-center text-gray-400 text-sm mt-2">PANTALLA</p>
            </div>

            {/* Mapa de asientos */}
            <div className="max-w-4xl mx-auto space-y-2 mb-6">
                {filasOrdenadas.map(fila => {
                    const asientos = butacasPorFila[fila].sort((a, b) => a.numero - b.numero);

                    return (
                        <div key={fila} className="flex items-center justify-center gap-2">
                            {/* Letra de fila */}
                            <span className="text-gray-400 font-bold w-8 text-center">{fila}</span>

                            {/* Asientos de la fila */}
                            <div className="flex gap-2">
                                {asientos.map(butaca => (
                                    <button
                                        key={butaca.id}
                                        onClick={() => handleSeatClick(butaca)}
                                        disabled={butaca.estado !== 'DISPONIBLE' && !selectedSeats.some(s => s.id === butaca.id)}
                                        className={`
                      w-10 h-10 rounded-lg border-2 transition-all duration-200
                      flex items-center justify-center text-xs font-bold
                      ${getSeatStyle(butaca)}
                    `}
                                        title={getSeatTooltip(butaca)}
                                    >
                                        {butaca.numero}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-600 rounded border-2 border-gray-500"></div>
                    <span className="text-sm text-gray-300">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded border-2 border-blue-400"></div>
                    <span className="text-sm text-gray-300">Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-yellow-600 rounded border-2 border-yellow-500 opacity-70"></div>
                    <span className="text-sm text-gray-300">Bloqueado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-600 rounded border-2 border-red-500 opacity-60"></div>
                    <span className="text-sm text-gray-300">Vendido</span>
                </div>
            </div>

            {/* Asientos seleccionados */}
            {selectedSeats.length > 0 && (
                <div className="mt-6 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                    <p className="text-sm font-semibold text-blue-300 mb-2">
                        Asientos seleccionados ({selectedSeats.length}/{maxSeats}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {selectedSeats.map(seat => (
                            <span
                                key={seat.id}
                                className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {seat.identificador}
                                <button
                                    onClick={() => handleSeatClick(seat)}
                                    className="hover:bg-blue-700 rounded-full p-0.5"
                                    title="Quitar asiento"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
