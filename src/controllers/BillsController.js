const connection = require('../database/connection');
const global = require('../global');

module.exports = {
    async index(request, response) {
        //const bills = await connection('bills').select('*');

        const bills = await connection('bills').select(
        "bills.*",
        "categories.description as cat_description")
        .join('categories','bills.category','categories.id');
    
        return response.json(bills);
    },

    async create(request, response){
        const {description,category,value,payment_receive,fixed_value,first_date} = request.body;        

        let dt = new Date(first_date);

        const [id] = await connection('bills').insert({
            description,
            category,
            value,
            due_day : dt.getDate(),
            payment_receive,
            fixed_value,
            first_date
        }, "id");

        return response.json({ id });
    },

    async delete(request,response){
        const { id } = request.params;

        var bill = [];
        bill = await connection('bills').select('id').where('id',id);
        if (bill.length <= 0) {
            return response.status(404).send();
        }

        var mov = [];
        mov = await connection('moves').select('id').where('bill',id);        
        if (mov.length > 0) {
            return response.status(400).json({erros:[{mensagem:'Não é possível excluir uma conta com movimentações. Neste caso apenas é possível finalizar a conta.'}]});
        }

        await connection('bills')
            .where('id',id)
            .delete();

        return response.status(204).send();
    },

    async close(request,response){
        const {id,last_date} = request.body;

        // verifica se a conta existe
        let bill = [];
        bill = await connection('bills').select('id').where('id',id);
        if (bill.length <= 0) {
            return response.status(400).json({error:"Conta não encontrada."});
        }

        // verifica se a conta já está fechada
        bill = [];
        bill = await connection('bills').select('id').where('id',id).whereNull('last_date');
        if (bill.length <= 0) {
            return response.status(400).json({error:"Conta já está finalizada."});
        }

        // verifica se a data para fechamento é maior ou igual que a data da última movimentação
        let mov = [];

        mov = await connection('moves').select('moves.resolution_date')
            .where('moves.bill',id)
            .orderBy('moves.resolution_date','desc')
            .limit(1);

        if (mov.length > 0) {
            if (mov[0].resolution_date > last_date) {
                return response.status(402).json({error:"A data para finalização deve ser maior ou igual a data da última movimentação."});
            }
        }
        
        // verifica se a data para fechamento é maior ou igual que a data inicial da conta
        bill = [];
        bill = await connection('bills')
            .select('first_date')
            .where('bills.id',id)
        if (bill[0].first_date > last_date) {
            return response.status(402).json({error:"A data para finalização deve ser maior ou igual a data da abertura da conta."});    
        }
        
        await connection('bills')
            .where("id",id)
            .update({last_date});

        return response.status(204).send();        
    },

    async pay(request,response){
        const {id, resolution_date, payment_type, value} = request.body;

        try {

            // verifica se a conta existe
            let bill_exist = []; 
            bill_exist = await connection('bills').select('id').where('id',id);
            if (bill_exist.length <= 0) {
                return response.status(400).json({error:"Conta não encontrada."});
            }

            // verifica se a conta não está paga.
            let dt = new Date(resolution_date);
            dt = new Date(dt.getFullYear(),dt.getMonth()+1,0); // dia 0 trás o último dia do mês
            
            paym_move = await connection('moves').select('id')
                .whereBetween('resolution_date',
                    [
                        dt.getFullYear()+'-'+(dt.getMonth() +1)+'-01', // dia 1 do mês
                        dt.getFullYear()+'-'+(dt.getMonth() +1)+'-'+String(dt.getDate()).padStart(2,'0') // último dia do mês
                    ])
                .andWhere('bill',id);

            if (paym_move.length > 0) {
                return response.status(400).json({error:"Esta conta já está paga. Data do pagamento: "+resolution_date});
            }

            let bills = await connection('bills').select('description','category','payment_receive').where('id',id);
            let description = bills[0].description;
            let category = bills[0].category;
            let payment_receive = bills[0].payment_receive;
            let bill = id;        

            const [id_move] = await connection('moves').insert({
                description,
                category,
                resolution_date,
                payment_receive,
                value, 
                bill, 
                payment_type,  
            }, "id");

            return response.status(204).send();
        
        } catch (error) {
            return response.status(400).json({error});
        }
    }
}