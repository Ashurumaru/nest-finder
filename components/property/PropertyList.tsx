'use client';

import React from 'react';
import { PostData } from '@/types/propertyTypes';
import EnhancedPropertyCard from './EnhancedPropertyCard';
import { motion } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageSquare } from "lucide-react";

interface PropertyListProps {
    properties: PostData[];
}

export default function PropertyList({ properties }: PropertyListProps) {
    if (!properties || properties.length === 0) {
        return (
            <Alert className="bg-blue-50 border-blue-100 my-8">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <AlertTitle className="text-blue-700">Объекты не найдены</AlertTitle>
                <AlertDescription className="text-blue-600">
                    По вашему запросу не найдено ни одного объекта недвижимости. Попробуйте изменить параметры поиска.
                </AlertDescription>
            </Alert>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {properties.map((property) => (
                <motion.div key={property.id} variants={item}>
                    <EnhancedPropertyCard property={property} />
                </motion.div>
            ))}
        </motion.div>
    );
}