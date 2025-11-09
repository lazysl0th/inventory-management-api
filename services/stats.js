const getNumStats = (fields, items) => fields.map(({ title }) => {
    const values = items.map(item => Number(item.values.find(v => v.field.title === title)?.value)).filter(value => !isNaN(value));
    if (!values.length) return { field: title, average: null, min: null, max: null, };
    const sum = values.reduce((a, b) => a + b, 0);
    return { field: title, average: sum / values.length, min: Math.min(...values), max: Math.max(...values), };
});


const getTextStats = (fields, items) => fields.map(({ title }) => {
    const counts = items.map(item => item.values.find(value => value.field.title === title)?.value).filter(Boolean).reduce((acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
    }, {});
    const topValues = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([value, count]) => ({ value, count }));
    return { field: title, topValues };
});

const statsType = {
    NUMBER: getNumStats,
    TEXT: getTextStats,
    LONGTEXT: (fields, items) => statsType.TEXT(fields, items),
};

export const calculateFieldStats = (groupedFields, items) => {
    if (!items.length) return {};
    const stats = Object.entries(groupedFields).reduce((acc, [type, fields]) => {
        if (statsType[type]) acc[type] = statsType[type](fields, items);
        return acc;
    }, {});
    return {
        numStats: [...(stats.NUMBER || [])],
        textStats: [...(stats.TEXT || []), ...(stats.LONGTEXT || [])],
    };
};