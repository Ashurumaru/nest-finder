'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Home, Heart, LogOut, Calendar } from "lucide-react";
import AccountSection from './AccountSection';
import MyPropertiesSection from './MyPropertiesSection';
import FavoritesSection from './FavoritesSection';
import BookedPropertiesSection from "@/components/profile/RentedPropertiesSection";

export default function ProfileClient({ user }: { user: any }) {
    const [selectedMenu, setSelectedMenu] = useState<string>("account");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleMenuSelect = (key: string) => {
        setIsLoading(true);
        setSelectedMenu(key);
        window.location.hash = key;
        // Reduced loading time for better responsiveness
        setTimeout(() => setIsLoading(false), 200);
    };

    useEffect(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash && ["account", "my-properties", "favorites", "booked-properties"].includes(hash)) {
            setSelectedMenu(hash);
        }
        setIsLoading(false);
    }, []);

    const handleSignOut = async () => {
        await signOut();
    };

    const menuItems = [
        {
            key: "account",
            label: "Мой аккаунт",
            icon: <User className="stroke-[1.5px]" />,
            content: user?.id ? <AccountSection userId={user.id} /> : <p>Пользователь не найден</p>
        },
        {
            key: "my-properties",
            label: "Моя недвижимость",
            icon: <Home className="stroke-[1.5px]" />,
            content: user?.id ? <MyPropertiesSection userId={user.id} /> : <p>Пользователь не найден</p>
        },
        {
            key: "favorites",
            label: "Мое избранное",
            icon: <Heart className="stroke-[1.5px]" />,
            content: user?.id ? <FavoritesSection userId={user.id} /> : <p>Пользователь не найден</p>
        },
        {
            key: "booked-properties",
            label: "Мои бронирования",
            icon: <Calendar className="stroke-[1.5px]" />,
            content: user?.id ? <BookedPropertiesSection userId={user.id} /> : <p>Пользователь не найден</p>
        },
    ];

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const menuItemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        },
        exit: {
            opacity: 0,
            y: -10,
            transition: { duration: 0.2 }
        }
    };

    return (
        <section className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    className="flex flex-col md:flex-row gap-6 items-start"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Profile Sidebar */}
                    <motion.aside
                        className="w-full md:w-1/4 bg-white backdrop-blur-sm bg-opacity-80 p-6 rounded-2xl shadow-sm border border-slate-100 transition-all"
                        variants={menuItemVariants}
                    >
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative mb-4 group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-indigo-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300 z-0"></div>

                                <div className="relative z-10 rounded-full p-1 bg-gradient-to-r from-blue-500 to-indigo-500">
                                    <div className="bg-white p-0.5 rounded-full">
                                        <Image
                                            src={user?.image ? user.image : "/images/default.png"}
                                            alt={`Фото профиля ${user?.name || 'пользователя'}`}
                                            width={90}
                                            height={90}
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800">{user?.name || 'Пользователь'}</h3>
                            <p className="text-sm text-slate-500 mt-1">{user?.email}</p>
                        </div>

                        <nav>
                            <motion.ul className="space-y-2" variants={containerVariants}>
                                {menuItems.map((item) => (
                                    <motion.li key={item.key} variants={menuItemVariants}>
                                        <button
                                            onClick={() => handleMenuSelect(item.key)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                                selectedMenu === item.key
                                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md"
                                                    : "hover:bg-slate-50 text-slate-700"
                                            }`}
                                        >
                                            <span className={`${selectedMenu === item.key ? "text-white" : "text-blue-500"}`}>
                                                {item.icon}
                                            </span>
                                            <span>{item.label}</span>
                                        </button>
                                    </motion.li>
                                ))}
                            </motion.ul>

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <motion.button
                                    variants={menuItemVariants}
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                                >
                                    <LogOut className="stroke-[1.5px]" />
                                    <span>Выйти</span>
                                </motion.button>
                            </div>
                        </nav>
                    </motion.aside>

                    {/* Main Content Area */}
                    <motion.main
                        className="w-full md:w-3/4 bg-white backdrop-blur-sm bg-opacity-80 p-6 rounded-2xl shadow-sm border border-slate-100 flex-grow"
                        variants={menuItemVariants}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedMenu}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={contentVariants}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="relative h-12 w-12">
                                            <div className="absolute top-0 left-0 h-full w-full rounded-full border-2 border-t-blue-500 border-r-transparent border-b-blue-200 border-l-blue-200 animate-spin"></div>
                                            <div className="absolute top-1 left-1 right-1 bottom-1 rounded-full border-2 border-t-indigo-500 border-r-transparent border-b-indigo-200 border-l-indigo-200 animate-spin animation-delay-150"></div>
                                        </div>
                                    </div>
                                ) : (
                                    menuItems.find((item) => item.key === selectedMenu)?.content
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.main>
                </motion.div>
            </div>
        </section>
    );
}