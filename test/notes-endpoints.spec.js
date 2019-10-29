const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeNotesArray } = require('./notes.fixtures.js')

describe('Notes Endpoints', function() {

    let db
    
    const testNotes = makeNotesArray()

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
  
    before('clean the table', () => db('noteful_notes').truncate())

    afterEach('cleanup', () => db('noteful_notes').truncate())

    describe(`GET /notes`, () => {

        context('Given there are notes in the database', () => {

            beforeEach('insert notes', () => {
                return db
                    .into('noteful_notes')
                    .insert(testNotes)
            })
            it('responds with 200 and all of the notes', () => {
                return supertest(app)
                    .get('/notes')
                    .expect(200, testNotes)
            })
        })
        context(`Given no notes`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/notes')
                    .expect(200, [])
            })
        })
    })

    describe(`GET /notes/:note_id`, () => {

        context('Given there are notes in the database', () => {

            beforeEach('insert notes', () => {
                return db
                    .into('noteful_notes')
                    .insert(testNotes)
            })
            it('responds with 200 and the specified note', () => {
                const noteId = 2
                const expectedNote = testNotes[noteId - 1]
                return supertest(app)
                    .get(`/notes/${noteId}`)
                    .expect(200, expectedNote)
            })
        })

        context(`Given no notes`, () => {
            it(`responds with 404`, () => {
                const noteId = 123456
                return supertest(app)
                    .get(`/notes/${noteId}`)
                    .expect(404, { error: { message: `Note doesn't exist` } })
            })
        })
    })

    describe(`POST /notes`, () => {
        it(`creates a note, responding with 201 and the new note`,  function() {
            this.retries(3)
            const newNote = {
                n_name: 'Nuova Nota',
                // modified: '2029-01-22T16:29:42.615Z',
                folderid: 3,
                content: 'Testo a caso'
            }
            return supertest(app)
                .post('/notes')
                .send(newNote)
                .expect(201)
                .expect(res => {
                    expect(res.body.n_name).to.eql(newNote.n_name)
                    expect(res.body).to.have.property('id')
                    expect(res.body.content).to.eql(newNote.content)
                    expect(res.body.folderid).to.eql(newNote.folderid)
                    expect(res.headers.location).to.eql(`/notes/${res.body.id}`)
                    const expected = new Date().toLocaleString()
                    const actual = new Date(res.body.modified).toLocaleString()
                    expect(actual).to.eql(expected)
                })
                .then(postRes =>
                    supertest(app)
                    .get(`/notes/${postRes.body.id}`)
                    .expect(postRes.body)
                )
                     
        })

        const requiredFields = ['n_name', 'folderid', 'content']

        requiredFields.forEach(field => {
            const newNote = {
                n_name: 'Nuova nota test',
                folderid: 1,
                content: 'Nuovo contenuto test'
            }

            it(`responds with 400 and an error message when the '${field}' is missing`, () => {
                delete newNote[field]

                return supertest(app)
                    .post('/notes')
                    .send(newNote)
                    .expect(400, {
                        error: { message: `Missing '${field}' in request body` }
                    })
            })
        })
    })

    describe.only(`DELETE /notes/:note_id`, () => {
        context('Given there are notes in the database', () => {
            const testNotes = makeNotesArray()
        
            beforeEach('insert notes', () => {
                return db
                    .into('noteful_notes')
                    .insert(testNotes)
            })
        
            it('responds with 204 and removes the note', () => {
                const idToRemove = 2
                const expectedNotes = testNotes.filter(note => note.id !== idToRemove)
                return supertest(app)
                    .delete(`/notes/${idToRemove}`)
                    .expect(204)
                    .then(res =>
                        supertest(app)
                            .get(`/notes`)
                            .expect(expectedNotes)
                    )
            })
        })
        context(`Given no notes`, () => {
        it(`responds with 404`, () => {
            const noteId = 123456
            return supertest(app)
                .delete(`/notes/${noteId}`)
                .expect(404, { error: { message: `Note doesn't exist` } })
        })
        })
    })

})