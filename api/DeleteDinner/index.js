let azure = require('azure-storage');

module.exports = async function (context, req) {
    const date = new Date(req.body);
    const partitionKey = date.toISOString().substring(0, 10);
    const rowKey = date.toISOString().substring(11);

    let connectionString = process.env.DinnerTimeConnection
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
}