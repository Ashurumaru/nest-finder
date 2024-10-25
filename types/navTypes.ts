import {NavIcons} from '@/components/icons';

export interface NavItem {
    title: string;
    href?: string;
    disabled?: boolean;
    external?: boolean;
    icon?: keyof typeof NavIcons;
    label?: string;
    description?: string;
}
