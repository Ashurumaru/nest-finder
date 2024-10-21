'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (status === 'loading') {
            return;
        }

        if (session?.user?.role === 'ADMIN') {
            setIsAdmin(true);
        }

        setLoading(false);
    }, [session, status]);

    if (loading) {
        return <p>Загрузка...</p>;
    }

    if (!isAdmin) {
        window.location.href = '/';
        return null;
    }

    return <>{children}</>;
}
