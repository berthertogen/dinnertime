module.exports = async function (context, req) {
	context.res = {
		body: context.bindings.dinnerEntity
			.sort((a, b) => (a.time > b.time ? -1 : 1))
			.map((dinner) => dinner.time)
			.slice(0, 10)
	};
};
