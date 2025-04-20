'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function PropertyPageSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
                <Card className="overflow-hidden bg-white" key={i}>
                    <Skeleton className="h-[220px] w-full" />
                    <CardContent className="pt-5">
                        <div className="flex gap-2 mb-2">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-7 w-full mb-3" />
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <div className="grid grid-cols-3 gap-2 mt-3">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                        </div>
                        <div className="mt-4">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0 pb-4">
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}