// utils/checkAdmin.ts
export const checkAdmin = async (): Promise<boolean> => {
    try {
        const res = await fetch('/api/auth/check-admin');
        const data = await res.json();

        return data.isAdmin;
    } catch (error) {
        console.error('Ошибка при проверке роли администратора:', error);
        return false;
    }
};
