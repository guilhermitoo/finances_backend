const connection = require('../database/connection');
const global = require('../global');

module.exports = {
    async getMonthName(request, response) {
        const { month } = request.query;    

        var name = global.getMonthName(month);

        return response.json({name});
    }
}