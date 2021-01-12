
exports.up = function(knex) {
    return knex.schema.createTable('users',function(table){
        table.increments().primary();
        
        table.string('first_name').notNullable();
        table.string('last_name');

        table.string('username').notNullable();
        table.unique('username');
        table.string('password').notNullable();

        table.timestamp('created_at',{ precision: 6 }).defaultTo(knex.fn.now(6));
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');  
};
