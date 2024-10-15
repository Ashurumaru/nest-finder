'use client';

import { useEffect, useState } from 'react';
import { BarGraph } from '@/components/Dashboard/charts/bar-graph';
import { PieGraph } from '@/components/Dashboard/charts/pie-graph';
import PageContainer from '@/components/Dashboard/layout/page-container';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDateRangePicker } from '@/components/Dashboard/date-range-picker';
import { BarGraphData, PieGraphData } from '@/types/metricTypes';
import { DateRange } from 'react-day-picker';

export default function DashboardPage() {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [saleListings, setSaleListings] = useState<number>(0);
    const [rentalListings, setRentalListings] = useState<number>(0);
    const [authorizedUsers, setAuthorizedUsers] = useState<number>(0);
    const [postViews, setPostViews] = useState<number>(0);
    const [barData, setBarData] = useState<BarGraphData[]>([]);
    const [pieData, setPieData] = useState<PieGraphData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Функция для получения метрик
    const fetchMetrics = async () => {
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

            // Проверка успешности запросов
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

            // Парсинг ответов
            const saleData = await saleRes.json();
            const rentalData = await rentalRes.json();
            const usersData = await usersRes.json();
            const viewsData = await viewsRes.json();
            const barGraphData = await barRes.json();
            const pieGraphData = await pieRes.json();

            // Обновление состояний
            setSaleListings(saleData.count);
            setRentalListings(rentalData.count);
            setAuthorizedUsers(usersData.count);
            setPostViews(viewsData.count);
            setBarData(barGraphData.data || []);
            setPieData(pieGraphData.data || []);
        } catch (error: any) {
            console.error('Ошибка при получении метрик:', error);
            setError(error.message || 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    };

    // Загрузка метрик при изменении диапазона дат
    useEffect(() => {
        fetchMetrics();
    }, [dateRange]);

    // Обработчик изменения диапазона дат
    const handleDateChange = (range: DateRange | undefined) => {
        setDateRange(range);
    };

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
                            {/* Количество объявлений на продажу */}
                            <MetricCard
                                title="Объявлений на продажу"
                                count={saleListings}
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

                            {/* Количество объявлений на аренду */}
                            <MetricCard
                                title="Объявлений на аренду"
                                count={rentalListings}
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

                            {/* Количество авторизованных пользователей */}
                            <MetricCard
                                title="Авторизованных пользователей"
                                count={authorizedUsers}
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

                            {/* Количество просмотров постов */}
                            <MetricCard
                                title="Просмотров постов"
                                count={postViews}
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
                            {/* График распределения объявлений по датам */}
                            <div className="col-span-4">
                                <BarGraph data={barData} />
                            </div>

                            {/* График распределения типов сделок */}
                            <div className="col-span-3">
                                <PieGraph data={pieData} />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </PageContainer>
    );
}

interface MetricCardProps {
    title: string;
    count: number;
    description: string;
    icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, count, description, icon }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{count.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);
