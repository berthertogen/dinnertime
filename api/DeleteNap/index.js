const azure = require('azure-storage');
const { DateTime } = require("luxon");

module.exports = async function (context, req) {
	const from = DateTime.fromISO(req.body.from);
	const partitionKey = from.toFormat('yyyy-MM-dd');
	const rowKey = from.toFormat('HH:mm:ss.SSS');

	let connectionString = process.env.DinnerTimeConnection;
	let tableService = azure.createTableService(connectionString);

	tableService.deleteEntity('naps', {
		PartitionKey: partitionKey,
		RowKey: rowKey
	}, (error, response) => {
		context.done(null, {
			statusCode: error ? 400 : 204,
			body: null
		});
	});

	if (req.body.till) {
		const till = DateTime.fromISO(req.body.till);
		const partitionKey = till.toFormat('yyyy-MM-dd');
		const rowKey = till.toFormat('HH:mm:ss.SSS');
		tableService.deleteEntity('naps', {
			PartitionKey: partitionKey,
			RowKey: rowKey
		}, (error, response) => {
			context.done(null, {
				statusCode: error ? 400 : 204,
				body: null
			});
		});
	}

	context.res = {
		body: { status: 'OK' }
	};
};
