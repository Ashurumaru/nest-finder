'use client';

import React, { useMemo } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';

interface PieGraphData {
    type: 'sale' | 'rent';
    count: number;
}

interface PieGraphProps {
    data: PieGraphData[];
}

export const PieGraph: React.FC<PieGraphProps> = ({ data }) => {
    const COLORS = ['#0088FE', '#FF8042']; // Цвета для типов сделок

    const total = useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.count, 0);
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Распределение по типам сделок</CardTitle>
                    <CardDescription>Нет данных для отображения.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        Выберите диапазон дат для отображения данных.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Распределение по типам сделок</CardTitle>
                <CardDescription>
                    Процентное соотношение объявлений на продажу и аренду.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
                <p className="text-center mt-2 text-sm text-muted-foreground">
                    Всего: {total.toLocaleString()}
                </p>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                {/* Дополнительный контент в футере при необходимости */}
            </CardFooter>
        </Card>
    );
};
