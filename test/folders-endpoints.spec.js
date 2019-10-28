const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')

describe.only('Folders Endpoints', function() {
    let db

    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
      })
    })
    app.set('db', db)
  
    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db('noteful_folders').truncate())

    context('Given there are folders in the database', () => {

        const testFolders = [
            {   
                id: 1,
                f_name: 'Primo'
            },
            {
                id: 2,
                f_name: 'Secondo'
            },
            {
                id: 3,
                f_name: 'Terzo'
            },
            {
                id: 4,
                f_name: 'Quarto'
            },
        ]
        beforeEach('insert folders', () => {
            return db
                .into('noteful_folders')
                .insert(testFolders)
        })
        it('GET /folders responds with 200 and all of the folders', () => {
            return supertest(app)
                .get('/folders')
                .expect(200, testFolders)
                // TODO: add more assertions about the body
        })
  
    })
})