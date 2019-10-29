const path = require('path')
const express = require('express')
const NoteService = require('./note-service')
const xss = require('xss')
const noteRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
    id: note.id,
    n_name: xss(note.n_name),
    folderid: note.folderid,
    modified: note.modified,
    content: xss(note.content)
})

noteRouter
    .route('/')
    .get((req, res, next) => {
        NoteService.getAllNotes(req.app.get('db'))
        .then(notes => {
            res.json(notes.map(serializeNote))
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
            .location(path.posix.join(req.originalUrl, `/${note.id}`))
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
    .patch(jsonParser, (req, res, next) => {
        const { n_name, folderid, content  } = req.body
        const noteToUpdate = { n_name, folderid, content }

        const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain either 'name', 'folder' or 'content'`
                }
            })
        }
            
        NoteService.updateNote(
            req.app.get('db'),
            req.params.note_id,
            noteToUpdate
        )
        .then(numRowsAffected => {
            res.status(204).end()
        })
        .catch(next)
    })


module.exports = noteRouter;