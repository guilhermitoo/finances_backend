
exports.up = function(knex) {
    return (
    knex.schema.alterTable('moves', function(table) {
        table.integer('payment_type').notNullable().defaultTo(1);
        table.foreign('payment_type').references('id').inTable('payment_types');    
    })  );
};

exports.down = function(knex) {
    return (knex.schema.alterTable('moves', function(table) {
        table.dropForeign('payment_type');        
        table.dropColumn('payment_type');
    }));
};
