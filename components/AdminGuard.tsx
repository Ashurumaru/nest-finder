'use client';

import { useState, useEffect } from 'react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const res = await fetch('/api/auth/check-admin');
                const data = await res.json();

                if (!data.isAdmin) {
                    window.location.href = '/';
                } else {
                    setIsAdmin(true);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Ошибка проверки администратора:', error);
                window.location.href = '/';
            }
        };

        checkAdmin();
    }, []);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return <>{isAdmin && children}</>;
}
