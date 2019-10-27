const knex = require('knex')
const NoteService = require('../src/Note/note-service')

describe(`Notes service object`, function() {

    let db

    let testNotes = [
        {   
            id: 1,
            n_name: 'Prima nota',
            modified: new Date('2029-01-22T16:28:32.615Z'),
            folderid: 1,
            content: 'Testo a caso'
        },
        {
            id: 2,
            n_name: 'Seconda nota',
            modified: new Date('2100-05-22T16:28:32.615Z'),
            folderid: 1,
            content: 'Testo a caso'
        },
        {
            id: 3,
            n_name: 'Terza nota',
            modified: new Date('1919-12-22T16:28:32.615Z'),
            folderid: 1,
            content: 'Testo a caso'
        },
        {
            id: 4,
            n_name: 'Quarta nota',
            modified: new Date('2028-01-22T16:28:32.615Z'),
            folderid: 1,
            content: 'Testo a caso'
        },
    ]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    after(() => db.destroy())

    before(() => db('noteful_notes').truncate())

    afterEach(() => db('noteful_notes').truncate())

    describe(`getAllNotes()`, () => {

        context(`Given 'noteful_notes' has data`, () => {

            beforeEach(() => {
                return db
                    .into('noteful_notes')
                    .insert(testNotes)
            })

            it(`getAllNotes() resolves all notes from 'noteful_notes' table`, () => {
                // test that NoteService.getAllNotes gets data from table
                return NoteService.getAllNotes(db)
                 .then(actual => {
                     expect(actual).to.eql(testNotes)
                 })
            })
            it(`deleteNote() removes a older by id from 'noteful_notes' table`, () => {
                const noteId = 3
                return NoteService.deleteNote(db, noteId)
                .then(() => NoteService.getAllNotes(db))
                .then(allNotes => {
                 // copy the test articles array without the "deleted" article
                const expected = testNotes.filter(note => note.id !== noteId)
                expect(allNotes).to.eql(expected)
                })
            })

        })

        context(`Given 'noteful_notes' has no data`, () => {

            it(`getAllNotes() resolves an empty array`, () => {
            return NoteService.getAllNotes(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
            })

            it(`insertNote() inserts a new note and resolves the new note with an 'id'`, () => {
                const newNote = {
                    id: 1,
                    n_name: 'Nuova nota',
                    modified: new Date(),
                    folderid: 2,
                    content: 'nuovo content'
                } 
        
                return NoteService.insertNote(db, newNote)
                    .then(actual => {
                        expect(actual).to.eql({
                            id: 1,
                            n_name: newNote.n_name,
                            modified: new Date(newNote.modified),
                            folderid: newNote.folderid,
                            content: newNote.content
                        })
                    })
            })

        })
        
    })

    
})



describe(`together they clash`, function() {
    let db

    let testNotes = [
        {   
            id: 1,
            n_name: 'Prima nota',
            modified: new Date('2029-01-22T16:28:32.615Z'),
            folderid: 1,
            content: 'Testo a caso'
        },
        {
            id: 2,
            n_name: 'Seconda nota',
            modified: new Date('2100-05-22T16:28:32.615Z'),
            folderid: 1,
            content: 'Testo a caso'
        },
        {
            id: 3,
            n_name: 'Terza nota',
            modified: new Date('1919-12-22T16:28:32.615Z'),
            folderid: 1,
            content: 'Testo a caso'
        },
        {
            id: 4,
            n_name: 'Quarta nota',
            modified: new Date('2028-01-22T16:28:32.615Z'),
            folderid: 1,
            content: 'Testo a caso'
        },
    ]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    after(() => db.destroy())

    before(() => db('noteful_notes').truncate())

    afterEach(() => db('noteful_notes').truncate())
    beforeEach(() => {
        return db
            .into('noteful_notes')
            .insert(testNotes)
    })
    it(`getById() resolves a note by id from 'noteful_notes' table`, () => {
            
    
        const noteId = 3
        const expectedNote = testNotes[noteId - 1]
        
        return NoteService.getById(db, noteId)
            
            .then(actual => {
                expect(actual).to.eql({
                    id: noteId,
                    n_name: expectedNote.n_name,
                    modified: expectedNote.modified,
                    folderid: expectedNote.folderid,
                    content: expectedNote.content    
                })
            })
    })

    it(`updateNote() updates a note from the 'noteful_notes' table`, () => {
        const idOfNoteToUpdate = 3
        const newNoteData = {
            n_name: 'updated name',
            folderid: 3,
            content: 'updated content'
        }
            return NoteService.updateNote(db, idOfNoteToUpdate, newNoteData)
               .then(() => NoteService.getById(db, idOfNoteToUpdate))
               .then(note => {
                expect(note).to.eql({
                   id: idOfNoteToUpdate,
                   modified: new Date(note.modified),
                   ...newNoteData,
                })
               })
    })
})


