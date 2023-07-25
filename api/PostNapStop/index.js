module.exports = async function (context, req) {
	const date = new Date(req.body);
	context.bindings.tableBinding = [];
	context.bindings.tableBinding.push({
		PartitionKey: date.toISOString().substring(0, 10),
		RowKey: date.toISOString().substring(11),
		time: req.body,
		type: 'stop'
	});
	context.res = {
		body: { status: 'OK' }
	};
};
