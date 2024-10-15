export interface BarGraphData {
    date: string;
    count: number;
}

export interface PieGraphData {
    type: 'sale' | 'rent';
    count: number;
}
