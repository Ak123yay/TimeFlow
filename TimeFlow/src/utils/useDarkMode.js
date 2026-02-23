import { useState, useEffect } from 'react';

/**
 * Reactive hook that returns true when the system prefers dark mode.
 * Any component using this hook will immediately re-render when the
 * OS theme is toggled.
 */
export function useDarkMode() {
    const [isDark, setIsDark] = useState(
        () => window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setIsDark(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return isDark;
}
