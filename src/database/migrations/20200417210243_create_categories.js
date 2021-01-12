
exports.up = function(knex) {
    return knex.schema.createTable('categories',function(table){
        table.increments().primary();
        
        table.string('description').notNullable();
        table.timestamp('created_at',{ precision: 6 }).defaultTo(knex.fn.now(6));
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('categories');  
};
