import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
    expiraEn: string; // ISO date string
    onExpire: () => void;
}

export const CountdownTimer = ({ expiraEn, onExpire }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [hasExpired, setHasExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const expireTime = new Date(expiraEn).getTime();
            const diff = expireTime - now;

            if (diff <= 0) {
                setHasExpired(true);
                setTimeLeft(0);
                onExpire();
                return 0;
            }

            return Math.floor(diff / 1000); // Segundos restantes
        };

        // Calcular tiempo inicial
        setTimeLeft(calculateTimeLeft());

        // Actualizar cada segundo
        const interval = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
        }, 1000);

        return () => clearInterval(interval);
    }, [expiraEn, onExpire]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getColorClass = (): string => {
        if (timeLeft <= 0) return 'text-red-500 bg-red-900/30 border-red-500';
        if (timeLeft <= 120) return 'text-orange-400 bg-orange-900/30 border-orange-500';
        return 'text-green-400 bg-green-900/30 border-green-500';
    };

    const getIcon = () => {
        if (timeLeft <= 120) return <AlertTriangle className="w-5 h-5" />;
        return <Clock className="w-5 h-5" />;
    };

    if (hasExpired) {
        return (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                    <p className="font-semibold text-red-300">Tiempo Agotado</p>
                    <p className="text-sm text-red-400">Tu reserva ha expirado. Los asientos han sido liberados.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`border rounded-lg p-4 flex items-center gap-3 ${getColorClass()}`}>
            {getIcon()}
            <div className="flex-1">
                <p className="text-sm font-medium">Tiempo restante para completar la compra:</p>
                <p className="text-2xl font-bold font-mono">{formatTime(timeLeft)}</p>
            </div>
            {timeLeft <= 120 && (
                <div className="text-sm text-orange-300">
                    ¡Date prisa!
                </div>
            )}
        </div>
    );
};
