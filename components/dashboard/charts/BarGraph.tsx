'use client';

import React, { useMemo } from 'react';
import {
    BarChart,
    CartesianGrid,
    XAxis,
    Tooltip,
    Bar,
    ResponsiveContainer,
} from 'recharts';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

interface BarGraphData {
    date: string;
    count: number;
}

interface BarGraphProps {
    data: BarGraphData[];
    barColor?: string;
}

export const BarGraph: React.FC<BarGraphProps> = ({ data, barColor = '#8884d8' }) => {
    const total = useMemo(() => {
        if (!data || data.length === 0) return 0;
        return data.reduce((acc, curr) => acc + curr.count, 0);
    }, [data]);

    // Если данных нет, возвращаем сообщение
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Распределение объявлений по датам</CardTitle>
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
        <Card>
            <CardHeader>
                <CardTitle>Распределение объявлений по датам</CardTitle>
                <CardDescription>
                    Количество объявлений, размещаемых в каждый день.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <Tooltip />
                        <Bar dataKey="count" fill={barColor} />
                    </BarChart>
                </ResponsiveContainer>
                <p className="text-center mt-2 text-sm text-muted-foreground">
                    Всего: {total.toLocaleString()}
                </p>
            </CardContent>
        </Card>
    );
};
