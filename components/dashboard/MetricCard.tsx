import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
    title: string;
    count: number;
    description: string;
    icon: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = React.memo(({ title, count, description, icon }) => {
    const formattedCount = useMemo(() => count.toLocaleString(), [count]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formattedCount}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
});

MetricCard.displayName = 'MetricCard';
