const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeFoldersArray } = require('./folders.fixtures.js')
 
describe('Folders Endpoints', function() {

    let db
    
    const testFolders = makeFoldersArray()

    // before('make knex instance', () => {
    //   db = knex({
    //     client: 'pg',
    //     connection: process.env.TEST_DB_URL,
    //   })
    // })

    // app.set('db', db) /// THIS GOES WITHIN THE BEFORE!! LEARN!

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })
  
    after('disconnect from db', () => db.destroy())
  
    before('clean the table', () => db('noteful_folders').truncate())

    afterEach('cleanup', () => db('noteful_folders').truncate())


    describe(`GET /folders`, () => {

        context('Given there are folders in the database', () => {

            beforeEach('insert folders', () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })
            it('responds with 200 and all of the folders', () => {
                return supertest(app)
                    .get('/folders')
                    .expect(200, testFolders)
            })
        })
        context(`Given no folders`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/folders')
                    .expect(200, [])
            })
        })
    })

    describe(`GET /folders/:folder_id`, () => {

        context('Given there are folders in the database', () => {

            beforeEach('insert folders', () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })
            it('responds with 200 and the specified folder', () => {
                const folderId = 2
                const expectedFolder = testFolders[folderId - 1]
                return supertest(app)
                    .get(`/folders/${folderId}`)
                    .expect(200, expectedFolder)
            })
        })

        context(`Given no folders`, () => {
            it(`responds with 404`, () => {
                const folderId = 123456
                return supertest(app)
                    .get(`/folders/${folderId}`)
                    .expect(404, { error: { message: `Folder doesn't exist` } })
            })
        })
    })

    describe(`POST /folders`, () => {
        it(`creates an folder, responding with 201 and the new folder`,  function() {
            const newFolder = {
                f_name: 'Nuovo Folder',
            }
            return supertest(app)
                .post('/folders')
                .send(newFolder)
                .expect(201)
                .expect(res => {
                    expect(res.body.f_name).to.eql(newFolder.f_name)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/folders/${res.body.id}`)
                })
                .then(postRes =>
                    supertest(app)
                    .get(`/folders/${postRes.body.id}`)
                    .expect(postRes.body)
                )
                     
        })
    })
    
})