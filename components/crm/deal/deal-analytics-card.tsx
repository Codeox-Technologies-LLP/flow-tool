import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    CheckCircle2,
    XCircle,
    Target,
    Activity,
} from "lucide-react";
import type { DealAnalyticsCardsProps } from "@/types/deal";

export function DealAnalyticsCards({
    analytics,
    loading,
}: DealAnalyticsCardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Card key={i} className="border-none shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Skeleton className="h-4 w-24 mb-2" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!analytics?.summary) return null;

    const { summary } = analytics;

    const cards = [
        {
            title: "Total Deals",
            value: summary.totalDeals,
            subtitle: `$${summary.totalValue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`,
            icon: Target,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Active",
            value: summary.active || 0,
            subtitle: summary.activeValue
                ? `$${summary.activeValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`
                : undefined,
            icon: Activity,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Won",
            value: summary.won || 0,
            subtitle: summary.wonValue
                ? `$${summary.wonValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`
                : undefined,
            icon: CheckCircle2,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Loss",
            value: summary.loss || 0,
            subtitle: summary.lossValue
                ? `$${summary.lossValue.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                })}`
                : undefined,
            icon: XCircle,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <Card key={index} className="border-none shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-muted-foreground">
                                        {card.title}
                                    </p>
                                    <p className="text-2xl font-bold">{card.value}</p>
                                    {card.subtitle && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {card.subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className={`rounded-full p-3 ${card.bgColor}`}>
                                    <Icon className={`h-6 w-6 ${card.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}