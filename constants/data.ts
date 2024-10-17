import { NavItem } from '@/types/navTypes';

export const navItems: NavItem[] = [
    {
        title: 'Дашборд',
        href: '/dashboard',
        icon: 'dashboard',
        label: 'Dashboard'
    },
    {
        title: 'Пользователи',
        href: '/dashboard/user',
        icon: 'user',
        label: 'user'
    },
    {
        title: 'Объявления',
        href: '/dashboard/post',
        icon: 'post',
        label: 'post'
    },
];

export const userRoles = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
];
