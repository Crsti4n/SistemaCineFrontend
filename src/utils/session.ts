// Utilidad para generar y gestionar sessionId único para usuarios no logueados

export const getOrCreateSessionId = (): string => {
    const SESSION_KEY = 'cinema_session_id';

    // Verificar si ya existe un sessionId
    let sessionId = localStorage.getItem(SESSION_KEY);

    if (!sessionId) {
        // Generar nuevo sessionId: timestamp + random
        sessionId = `SES-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        localStorage.setItem(SESSION_KEY, sessionId);
    }

    return sessionId;
};

export const clearSessionId = (): void => {
    localStorage.removeItem('cinema_session_id');
};
