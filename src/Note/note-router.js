const express = require('express')
const NoteService = require('./note-service')

const noteRouter = express.Router()
const jsonParser = express.json()

noteRouter
    .route('/')
    .get((req, res, next) => {
        NoteService.getAllNotes(req.app.get('db'))
        .then(notes => {
            res.json(notes)
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { n_name, modified, folderid, content } = req.body
        const newNote = { n_name, modified, folderid, content }
        NoteService.insertNote(
            req.app.get('db'),
            newNote
        )
        .then(note => {
           res
            .status(201)
            .location(`/notes/${note.id}`)
            .json(note)
        })
        .catch(next)
    })

noteRouter
    .route('/:note_id')
    .get((req, res, next) => {
        const knex = req.app.get('db')
    
        NoteService.getById(knex, req.params.note_id)
        .then(note => {
            if (!note) {
                return res.status(404).json({
                    error: { message: `Note doesn't exist` }
                })
            }
            res.json(note)
        })
        .catch(next)
    })


module.exports = noteRouter;