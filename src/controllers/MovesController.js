const connection = require('../database/connection');
const knex = require('knex');
const global = require('../global');

module.exports = {
   // get para listar o histórico de algum mês específico.

   async index(request, response) {
      const { month, year } = request.body;

      // pega o primeiro e o último dia daquele mês
      let dt = new Date(year,month,0);
      let datfim = year+'-'+(dt.getMonth() +1)+'-'+String(dt.getDate()).padStart(2,'0');
      let datini = year+'-'+(dt.getMonth() +1)+'-01';

      let moves = await connection('moves')
         .whereBetween('resolution_date',[datini,datfim])
         .select('*');
      return response.json(moves); 
   },

   async open(request, response) {
      const { month , year , type } = request.query; 
      let resp = { bills : [] };
      let dt = new Date(year,month,0);
      let datfim = year+'-'+(dt.getMonth() +1)+'-'+String(dt.getDate()).padStart(2,'0');
      let datini = year+'-'+(dt.getMonth() +1)+'-01';

      resp.bills = await connection('bills').select('bills.description',
         'null as invoice_id', 'bills.id as bill_id',
         'bills.category','bills.value','bills.due_day','bills.payment_receive',
         'categories.description as cat_description').
         whereNotIn('bills.id',connection('moves').select('bill').whereBetween('resolution_date',[datini,datfim]).andWhereNot('bill',null)).
         join('categories','bills.category','categories.id').
         andWhere('bills.payment_receive',type.toUpperCase()) // verifica o tipo se é Pagar ou Receber
         .andWhere('bills.first_date','<',datfim) // verifica se está dentro da data inicial pra exibir
         .whereNull(`bills.last_date`)
         .orWhere('bills.last_date','>=',datini) // verifica se está dentro da data final pra exibir
         .unionAll(
            connection('invoices').select("invoices.description || ' (' || invoices.portion || '/' || invoices.total_portion || ')'",
            'invoices.id as invoice_id','null as bill_id',
            'invoices.category','invoices.value','invoices.due_day','invoices.payment_receive',
            'categories.description as cat_description').
            whereNotIn('invoices.id',connection('moves').select('invoice').whereBetween('resolution_date',[datini,datfim]).andWhereNot('invoice',null)).
            join('categories','invoices.category','categories.id').
            andWhere('invoices.payment_receive',type.toUpperCase()).
            andWhereBetween('invoices.due_date',[datini,datfim]) //andWhere('month_id',month_id)
         );
         
      for (let index = 0; index < resp.bills.length; index++) {
         const element = resp.bills[index];

         resp.bills[index].id = index+1;
      }

      return response.json(resp);
   },

   async paid(request, response) {
      const { month , year , type } = request.query;

      try
      {
         let resp = { bills : [] };

         let dt = new Date(year,month,0);
         let datfim = year+'-'+(dt.getMonth() +1)+'-'+String(dt.getDate()).padStart(2,'0');
         let datini = year+'-'+(dt.getMonth() +1)+'-01';
         
         resp.bills = await connection('moves').select('moves.id as move_id, moves.*',
         'categories.description as cat_description',
         'payment_types.description as payment_type_description').
         join('categories','moves.category','categories.id').
         join('payment_types','moves.payment_type','payment_types.id').
            whereBetween('moves.resolution_date',[datini,datfim]).
            andWhere('moves.payment_receive',type.toUpperCase()).andWhereRaw('((bill is not null) or (invoice is not null))');

         for (let index = 0; index < resp.bills.length; index++) {
            const element = resp.bills[index];

            resp.bills[index].id = index+1;
         }

         return response.json(resp);
      } catch(err) {
         return response.status(400).json({err});
      }
   },

   async create(request, response) {
      const {date, description, category, payment_receive, value, bill, payment_type, invoice } = request.body;
      
      var resolution_date = date;

      const [id] = await connection('moves').insert({
         description,
         category,
         resolution_date,
         payment_receive,
         value, 
         bill, 
         payment_type, 
         invoice
      }, "id");

      return response.json({id});
   },

   async delete(request,response){
      const { id } = request.params;

      var move = [];
      move = await connection('moves').select('id').where('id',id);
      if (move.length <= 0) {
          return response.status(404).send();
      }

      await connection('moves')
          .where('id',id)
          .delete();

      return response.status(204).send();
  }
}