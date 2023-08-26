const { DateTime } = require("luxon");

module.exports = async function (context, req) {
	const from = DateTime.fromISO(req.body.from);
	context.bindings.tableBinding = [];
	context.bindings.tableBinding.push({
		PartitionKey: from.toFormat('yyyy-MM-dd'),
		RowKey: from.toFormat('HH:mm:ss.SSS'),
		time: from.toISO(),
		type: 'start'
	});
	if (req.body.till) {
	const till = DateTime.fromISO(req.body.till);
		context.bindings.tableBinding.push({
			PartitionKey: till.toFormat('yyyy-MM-dd'),
			RowKey: till.toFormat('HH:mm:ss.SSS'),
			time: till.toISO(),
			type: 'stop'
		});
	}
	context.res = {
		body: { status: 'OK' }
	};
};
