export const INVENTORY_ORDER = {
    latest: { createdAt: 'desc' },
    topItems: { items: { _count: 'desc' } },
} as const