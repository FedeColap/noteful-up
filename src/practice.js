require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
})

knexInstance.from('noteful_folders').select('*')
    .then(result => {
        console.log(result)
    })

