'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { BarGraph } from '@/components/dashboard/charts/BarGraph';
import { PieGraph } from '@/components/dashboard/charts/PieGraph';
import PageContainer from '@/components/dashboard/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDateRangePicker } from '@/components/dashboard/DateRangePicker';
import { BarGraphData, PieGraphData } from '@/types/metricTypes';
import { DateRange } from 'react-day-picker';
import { MetricCard } from '@/components/dashboard/MetricCard';

export default function DashboardPage() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [metrics, setMetrics] = useState({
        saleListings: 0,
        rentalListings: 0,
        authorizedUsers: 0,
        postViews: 0,
        barData: [] as BarGraphData[],
        pieData: [] as PieGraphData[],
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Оптимизация рендеринга графиков с помощью useMemo
    const barDataMemo = useMemo(() => metrics.barData, [metrics.barData]);
    const pieDataMemo = useMemo(() => metrics.pieData, [metrics.pieData]);

    // Функция для получения метрик
    const fetchMetrics = useCallback(async () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (dateRange?.from) params.append('startDate', dateRange.from.toISOString());
        if (dateRange?.to) params.append('endDate', dateRange.to.toISOString());

        try {
            const [
                saleRes,
                rentalRes,
                usersRes,
                viewsRes,
                barRes,
                pieRes,
            ] = await Promise.all([
                fetch(`/api/metrics/saleListings?${params.toString()}`),
                fetch(`/api/metrics/rentalListings?${params.toString()}`),
                fetch(`/api/metrics/authorizedUsers?${params.toString()}`),
                fetch(`/api/metrics/postViews?${params.toString()}`),
                fetch(`/api/metrics/barGraphData?${params.toString()}`),
                fetch(`/api/metrics/pieGraphData?${params.toString()}`),
            ]);

            if (
                !saleRes.ok ||
                !rentalRes.ok ||
                !usersRes.ok ||
                !viewsRes.ok ||
                !barRes.ok ||
                !pieRes.ok
            ) {
                throw new Error('Ошибка при загрузке данных');
            }

            const saleData = await saleRes.json();
            const rentalData = await rentalRes.json();
            const usersData = await usersRes.json();
            const viewsData = await viewsRes.json();
            const barGraphData = await barRes.json();
            const pieGraphData = await pieRes.json();

            setMetrics({
                saleListings: saleData.count,
                rentalListings: rentalData.count,
                authorizedUsers: usersData.count,
                postViews: viewsData.count,
                barData: barGraphData.data || [],
                pieData: pieGraphData.data || [],
            });
        } catch (error: any) {
            console.error('Ошибка при получении метрик:', error);
            setError(error.message || 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    // Загрузка метрик при изменении диапазона дат
    useEffect(() => {
        fetchMetrics();
    }, [dateRange, fetchMetrics]);

    // Обработчик изменения диапазона дат
    const handleDateChange = useCallback((range: DateRange | undefined) => {
        setDateRange(range);
    }, []);

    return (
        <PageContainer scrollable>
            <div className="space-y-2">
                {/* Заголовок и Календарь */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-2 md:space-y-0">
                    <h2 className="text-2xl font-bold tracking-tight">
                        Привет, добро пожаловать обратно 👋
                    </h2>
                    <div className="flex items-center space-x-2">
                        <CalendarDateRangePicker date={dateRange} onChange={handleDateChange} />
                        <Button onClick={fetchMetrics} disabled={loading}>
                            Обновить
                        </Button>
                    </div>
                </div>

                {/* Обработка ошибок */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Вкладки */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Аналитика</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview" className="space-y-4">
                        {/* Карточки с метриками */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <MetricCard
                                title="Объявлений на продажу"
                                count={metrics.saleListings}
                                description="Обновлено на основе выбранного диапазона дат"
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                }
                            />

                            <MetricCard
                                title="Объявлений на аренду"
                                count={metrics.rentalListings}
                                description="Обновлено на основе выбранного диапазона дат"
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                }
                            />

                            <MetricCard
                                title="Авторизованных пользователей"
                                count={metrics.authorizedUsers}
                                description="Обновлено на основе выбранного диапазона дат"
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                }
                            />

                            <MetricCard
                                title="Просмотров постов"
                                count={metrics.postViews}
                                description="Обновлено на основе выбранного диапазона дат"
                                icon={
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        className="h-4 w-4 text-muted-foreground"
                                    >
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                    </svg>
                                }
                            />
                        </div>

                        {/* Графики */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                            <div className="col-span-4">
                                <BarGraph data={barDataMemo} />
                            </div>
                            <div className="col-span-3">
                                <PieGraph data={pieDataMemo} />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </PageContainer>
    );
}
