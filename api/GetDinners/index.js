module.exports = async function (context, req) {
    const yesterday = new Date(new Date().setDate(new Date().getDate()-1))
    console.log(yesterday);
    context.res = {
        body: context.bindings.dinnerEntity
            .filter(dinner => new Date(dinner.time) > yesterday)
            .sort((a, b) => a.time > b.time ? -1 : 1)
            .map(dinner => dinner.time)
            .slice(0, 10)
    };
}