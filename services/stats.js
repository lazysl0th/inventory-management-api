const getNumStats = (fields, items) => fields.map(({ title: key }) => {
    const values = items.map((item) => item.data?.[key]).filter((value) => typeof value === 'number' && !isNaN(value));
    if (!values.length) return { field: key, average: null, min: null, max: null };
    const sum = values.reduce((a, b) => a + b, 0);
    return {
        field: key,
        average: sum / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
    };
})

const getTextStats = (fields, items) => fields.map(({ title: key }) => {
    const counts = {};
    for (const item of items) {
        const value = item.data?.[key];
        if (!value) continue;
        counts[value] = (counts[value] || 0) + 1;
    }
    const topValues = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([value, count]) => ({ value, count }));
    return { field: key, topValues };
})

const statsType = {
    NUMBER: getNumStats,
    TEXT: getTextStats,
    LONGTEXT: (fields, items) => statsType.TEXT(fields, items),
};

export const calculateFieldStats = (groupedFields, items) => {
    if (!items.length) return {};
    return Object.entries(groupedFields).reduce((acc, [type, fields]) => {
        if (statsType[type]) acc[type] = statsType[type](fields, items);
        return acc;
    }, {});
};