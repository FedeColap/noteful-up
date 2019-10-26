const knex = require('knex')
const FolderService = require('../src/folder-service')

describe(`Folders service object`, function() {

    let db

    let testFolders = [
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
    ]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    after(() => db.destroy())

    before(() => db('noteful_folders').truncate())

    afterEach(() => db('noteful_folders').truncate())

    describe(`getAllFolders()`, () => {

        context(`Given 'noteful_folders' has data`, () => {

            beforeEach(() => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })

            it(`getAllFolders() resolves all folders from 'noteful_folders' table`, () => {
                // test that FolderService.getAllFolders gets data from table
                return FolderService.getAllFolders(db)
                 .then(actual => {
                     expect(actual).to.eql(testFolders)
                 })
            })

        })

        context(`Given 'noteful_folders' has no data`, () => {
            it(`getAllFolders() resolves an empty array`, () => {
            return FolderService.getAllFolders(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
            })
        })
        
    })
})