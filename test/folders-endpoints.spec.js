const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeFoldersArray, makeMaliciousFolder } = require('./folders.fixtures.js')
 
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


    describe(`GET /api/folders`, () => {

        context('Given there are folders in the database', () => {

            beforeEach('insert folders', () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })
            it('responds with 200 and all of the folders', () => {
                return supertest(app)
                    .get('/api/folders')
                    .expect(200, testFolders)
            })
        })
        context(`Given no folders`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/folders')
                    .expect(200, [])
            })
        })
    })

    describe(`GET /api/folders/:folder_id`, () => {

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
                    .get(`/api/folders/${folderId}`)
                    .expect(200, expectedFolder)
            })
        })
        context(`Given an XSS attack folder`, () => {
            const { maliciousFolder, expectedFolder } = makeMaliciousFolder()
      
            beforeEach('insert malicious folder', () => {
              return db
                .into('noteful_folders')
                .insert([maliciousFolder])
            })
      
            it('removes XSS attack content', () => {
              return supertest(app)
                .get(`/api/folders`)
                .expect(200)
                .expect(res => {
                  expect(res.body[0].f_name).to.eql(expectedFolder.f_name)
                })
            })
        })

        context(`Given no folders`, () => {
            it(`responds with 404`, () => {
                const folderId = 123456
                return supertest(app)
                    .get(`/api/folders/${folderId}`)
                    .expect(404, { error: { message: `Folder doesn't exist` } })
            })
        })
    })

    describe(`POST /api/folders`, () => {
        it(`creates an folder, responding with 201 and the new folder`,  function() {
            const newFolder = {
                f_name: 'Nuovo Folder',
            }
            return supertest(app)
                .post('/api/folders')
                .send(newFolder)
                .expect(201)
                .expect(res => {
                    expect(res.body.f_name).to.eql(newFolder.f_name)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/folders/${res.body.id}`)
                })
                .then(postRes =>
                    supertest(app)
                    .get(`/api/folders/${postRes.body.id}`)
                    .expect(postRes.body)
                )
                     
        })

        it(`responds with 400 and an error message when the 'f_name' is missing`, () => {
            return supertest(app)
                .post('/api/folders')
                .send({
                    f_name: null,
                })
                .expect(400, {
                    error: { message: `Missing 'f_name' in request body` }
                })
        })
    })

    describe(`DELETE /api/folders/:folder_id`, () => {
        context('Given there are folders in the database', () => {
            const testFolders = makeFoldersArray()
        
            beforeEach('insert folders', () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })
        
            it('responds with 204 and removes the folder', () => {
                const idToRemove = 2
                const expectedFolders = testFolders.filter(folder => folder.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/folders/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/folders`)
                            .expect(expectedFolders)
                    )
            })
        })
        context(`Given no folders`, () => {
        it(`responds with 404`, () => {
            const folderId = 123456
            return supertest(app)
                .delete(`/api/folders/${folderId}`)
                .expect(404, { error: { message: `Folder doesn't exist` } })
        })
        })
    })

    describe(`PATCH /api/folders/:folder_id`, () => {
        context(`Given no folders`, () => {
            it(`responds with 404`, () => {
                const folderId = 123456
                return supertest(app)
                    .patch(`/api/folders/${folderId}`)
                    .expect(404, { error: { message: `Folder doesn't exist` } })
            })
        })
        context('Given there are folders in the database', () => {
            const testFolders = makeFoldersArray()
            
            beforeEach('insert folders', () => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })
            
            it('responds with 204 and updates the folder', () => {
                const idToUpdate = 2
                const updateFolder = {
                    f_name: 'updated folder name',
                }
                const expectedFolder = {
                    ...testFolders[idToUpdate - 1],
                    ...updateFolder
                }
                
                    return supertest(app)
                        .patch(`/api/folders/${idToUpdate}`)
                        .send(updateFolder)
                        .expect(204)
                        .then(res =>
                            supertest(app)
                            .get(`/api/folders/${idToUpdate}`)
                            .expect(expectedFolder)
                        )
            })
            it(`responds with 400 when no required fields supplied`, () => {
                const idToUpdate = 2
                return supertest(app)
                    .patch(`/api/folders/${idToUpdate}`)
                    .send({ irrelevantField: 'foo' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain  the name of the folder`
                        }
                    })
            })
            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2
                const updateFolder = {
                    f_name: 'updated folder name',
                }
                const expectedFolder = {
                    ...testFolders[idToUpdate - 1],
                    ...updateFolder
                }
                    
                return supertest(app)
                    .patch(`/api/folders/${idToUpdate}`)
                    .send({
                        ...updateFolder,
                        fieldToIgnore: 'should not be in GET response'
                    })
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/api/folders/${idToUpdate}`)
                            .expect(expectedFolder)
                    )
                
            })
        })
    })
    
})