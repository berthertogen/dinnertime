module.exports = async function (context, req) {
    const yesterday = new Date(new Date().setDate(new Date().getDate()-1))
    context.res = {
        body: context.bindings.napEntity
            .filter(nap => new Date(nap.time) > yesterday)
            .sort((a, b) => a.time > b.time ? -1 : 1)
            .map(nap => ({
                time: nap.time,
                type: nap.type
            }))
            .slice(0, 10)
    };
}