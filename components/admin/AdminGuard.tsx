'use client';

import { useState, useEffect } from 'react';
import { checkAdmin } from '@/utils/checkAdmin';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const verifyAdmin = async () => {
            const adminStatus = await checkAdmin();
            if (!adminStatus) {
                window.location.href = '/';
            } else {
                setIsAdmin(true);
                setLoading(false);
            }
        };

        verifyAdmin();
    }, []);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    return <>{isAdmin && children}</>;
}
