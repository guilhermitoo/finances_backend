const { response } = require('express');
const connection = require('../database/connection');

module.exports = {
    async auth() {
        const {username,password} = request.body;

        try {
            let p = CryptoJS.SHA256(password);

            /*
                verifica se o usuário existe
                SE SIM:
                    Então veririca se a senha está válida
                    SE SIM:
                        Então verifica se tem hash ativa
                        SE SIM:
                            Então retorna a mesma.
                        SE NÃO:
                            Então gera hash e retorna.
                    SE NÃO:
                        Então retorna erro informando senha incorreta.
                SE NÃO:
                    Então retorna erro informando usuário inexistente.
            */

            connection('users').select('*').where(username).then(function(users) {
                if (users.length > 0) {
                    if (users[0].password === p) {
                        connection('sessions').select('*').where('user_id',users[0].id).then(function(sessions) {
                            if (sessions.length > 0) {
    
                            }
                        });
                    }
                    else
                    {
                        return response.status(401).json({message:"Invalid password."});
                    }
                }
                else
                {
                    return response.status(401).json({message:"User not registered."});
                }                
            })

            

        } catch (error) {
            return response.status(400).json(error);
        }
    },

    async create() {
        const {first_name,last_name,username,password} = request.body;        

        try {

            let p = CryptoJS.SHA256(password);

            const [id] = await connection('users').insert({
                first_name,
                last_name,
                username,
                password: p
            }, "id");
    
            return response.json({ id });   
        } catch (error) {
            return response.status(400).json(error);
        }        
    },

}