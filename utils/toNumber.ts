// utils/toNumber.ts

import { Decimal } from "@prisma/client/runtime/library";


export function toNumber(value: number | Decimal): number {
    return typeof value === 'number' ? value : value.toNumber();
}
