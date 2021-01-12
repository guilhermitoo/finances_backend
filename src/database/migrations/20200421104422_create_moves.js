
exports.up = function(knex) {
    return (
    knex.schema.createTable('moves',function(table){
        table.increments().primary();
        
        table.string('description').notNullable();
        table.integer('category').notNullable();
        table.foreign('category').references('id').inTable('categories');      
        table.integer('bill');
        table.foreign('bill').references('id').inTable('bills');  
        table.date('resolution_date').notNullable();        
        table.enu('payment_receive',['P','R']).notNullable(); // P = pagamento, R = recebimento
        table.decimal('value').notNullable();          
        table.timestamp('created_at',{ precision: 6 }).defaultTo(knex.fn.now(6));
    })
    );
};

exports.down = function(knex) {
    return knex.schema.dropTable('moves');    
};
