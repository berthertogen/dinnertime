const azure = require('azure-storage');
const { DateTime } = require("luxon");

module.exports = async function (context, req) {
	const date = DateTime.fromISO(req.body);
	const partitionKey = date.toFormat('yyyy-MM-dd');
	const rowKey = date.toFormat("HH:mm:ss.SSS");

	let connectionString = process.env.DinnerTimeConnection;
	let tableService = azure.createTableService(connectionString);

	let item = {
		PartitionKey: partitionKey,
		RowKey: rowKey
	};

	tableService.deleteEntity('dinners', item, (error, response) => {
		let res = {
			statusCode: error ? 400 : 204,
			body: null
		};
		context.done(null, res);
	});
	context.res = {
		body: { status: 'OK' }
	};
};
