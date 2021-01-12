
exports.up = function(knex) {
    return knex.schema.createTable('invoices',function(table){
        table.increments().primary();
        
        table.string('description').notNullable();
        table.integer('category').notNullable();
        table.foreign('category').references('id').inTable('categories');
        table.decimal('value').notNullable();
        table.integer('due_day').notNullable();
        table.date('due_date').notNullable();
        table.enu('payment_receive',['P','R']).notNullable(); // P = pagamento, R = recebimento
        table.integer('portion').notNullable();
        table.integer('total_portion').notNullable();
        table.timestamp('created_at',{ precision: 6 }).defaultTo(knex.fn.now(6));
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('invoices');    
};