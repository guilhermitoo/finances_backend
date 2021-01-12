const connection = require('../database/connection');
const { getNextMonth } = require('../global');
const global = require('../global');

module.exports = {
    async index(request, response) {
        const invoices = await connection('invoices').select('*');
    
        return response.json(invoices);
    },

    async create(request, response){
        const {description,category,total,payment_receive,total_portion,due_date} = request.body;                        

        let id_list = new Array(total_portion);
        let value = total/total_portion;
        
        for (let index = 0; index < total_portion; index++) {
            let portion = index+1
            
            // let dt = new Date(due_date);
            // dt.setMonth(dt.getMonth()+index);
            // let ddate = dt.toDateString;

            let ddate = due_date;

            if (!String(ddate).includes(':')) {
                ddate += ' 00:00:00';
            }

            ddate = await getNextMonth(ddate,index);

            let dd = new Date(ddate);
            let due_day = dd.getDate();

            const [id] = await connection('invoices').insert({
                description,
                category,
                value,
                due_date : ddate,
                due_day, 
                payment_receive,
                portion,
                total_portion,
            }, "id");

            id_list[index] = id;
        }

        return response.json({ "invoices": id_list });
    },

    async delete(request,response){
        const { id } = request.params;

        await connection('invoices')
            .where('id',id)
            .delete();

        return response.status(204).send();
    }
}