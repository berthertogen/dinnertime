const { DateTime } = require("luxon");

module.exports = async function (context, req) {
	const date = DateTime.fromISO(req.body);
	context.bindings.tableBinding = [];
	context.bindings.tableBinding.push({
		PartitionKey: date.toFormat('yyyy-MM-dd'),
		RowKey: date.toFormat('HH:mm:ss.SSS'),
		time: date.toISO(),
	});
	context.res = {
		body: { status: 'OK' }
	};
};
