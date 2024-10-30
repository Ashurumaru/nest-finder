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
        href: '/dashboard/property',
        icon: 'post',
        label: 'property'
    },
];

export const userRoles = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
];

// Данные для типа недвижимости и количества комнат
export const propertyTypes = [
    { label: "Квартира", value: "APARTMENT" },
    { label: "Дом", value: "HOUSE" },
    { label: "Участок", value: "LAND_PLOT" },
];

export const roomCounts = [
    { label: "1 комн.", value: "1" },
    { label: "2 комн.", value: "2" },
    { label: "3 комн.", value: "3" },
    { label: "4 комн.", value: "4" },
    { label: "5+ комн.", value: "5" },
];

export const transactionTypes = [
    { label: "Продажа", value: "SALE" },
    { label: "Аренда", value: "RENT" },
];