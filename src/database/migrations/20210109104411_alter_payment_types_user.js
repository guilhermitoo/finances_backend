
exports.up = function(knex) {
    return (
        knex.schema.alterTable('payment_types', function(table) {
            table.integer('user_id').notNullable();
            table.foreign('user_id').references('id').inTable('users');    
        })
    );
};

exports.down = function(knex) {
    return (
        knex.schema.alterTable('payment_types', function(table) {
            table.dropForeign('user_id');
            table.dropColumn('user_id');
        })
    );
};
