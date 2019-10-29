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
        const { n_name, folderid, content } = req.body
        const newNote = { n_name, folderid, content }
        for (const [key, value] of Object.entries(newNote)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }
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
    .all((req, res, next) => {
        NoteService.getById(
            req.app.get('db'),
            req.params.note_id
        )
        .then(note => {
            if (!note) {
                return res.status(404).json({
                    error: { message: `Note doesn't exist` }
                })
            }
            res.note = note // save the note for the next middleware
            next() // don't forget to call next so the next middleware happens!
        })
        .catch(next)
    })
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
    .delete((req, res, next) => {
        NoteService.deleteNote(
            req.app.get('db'),
            req.params.note_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })


module.exports = noteRouter;