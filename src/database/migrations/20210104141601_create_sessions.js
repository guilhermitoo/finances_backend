
exports.up = function(knex) {
    return knex.schema.createTable('sessions',function(table){
        table.increments().primary();
        
        table.string('access_token').notNullable();
        table.string('refresh_token').notNullable();
        table.integer('user_id').notNullable();
        table.foreign('user_id').references('id').inTable('users');
        table.timestamp('expiration',{ precision: 6 }).notNullable();
        table.timestamp('created_at',{ precision: 6 }).defaultTo(knex.fn.now(6));
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sessions');  
};
