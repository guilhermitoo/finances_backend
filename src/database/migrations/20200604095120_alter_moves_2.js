
exports.up = function(knex) {
    return (
        knex.schema.alterTable('moves', function(table) {
            table.integer('invoice');
            table.foreign('invoice').references('id').inTable('invoices');    
        })  );
};

exports.down = function(knex) {
    return (knex.schema.alterTable('moves', function(table) {
        table.dropForeign('invoice');
        table.dropColumn('invoice');
    }));
};
