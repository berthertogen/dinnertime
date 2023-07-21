module.exports = async function (context, req) {
    const yesterday = new Date(new Date().setDate(new Date().getDate()-1))
    const filteredAndSortedNaps = context.bindings.napEntity
        .filter(nap => new Date(nap.time) > yesterday)
        .sort((a, b) => a.time > b.time ? 1 : -1)

    const mappedNaps = [];
    let prevNap = null;
    for (i = 0; i < filteredAndSortedNaps.length; i++) {
        const nap = filteredAndSortedNaps[i];
        if (nap.type === 'stop' && prevNap && prevNap.type === 'start') {
            mappedNaps.push({
                from: new Date(prevNap.time),
                till: new Date(nap.time),
                sleeping: false,
            });
        }
        if (nap.type === 'start' && i === filteredAndSortedNaps.length - 1) {
            mappedNaps.push({
                from: new Date(nap.time),
                till: undefined,
                sleeping: true,
            });
        }
        prevNap = nap;
    }

    context.res = {
        body: {
            rawNaps: filteredAndSortedNaps
                .slice(0, 20)
                .sort((a, b) => a.time > b.time ? -1 : 1),
            naps: mappedNaps
                .slice(0, 10)
                .sort((a, b) => a.from > b.from ? -1 : 1),
        }
    };
}