const express = require('express')
const FolderService = require('./folder-service')

const folderRouter = express.Router()
const jsonParser = express.json()

folderRouter
    .route('/')
    .get((req, res, next) => {
        FolderService.getAllFolders(req.app.get('db'))
        .then(folders => {
            res.json(folders)
        })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { f_name } = req.body
        const newFolder = { f_name }
        for (const [key, value] of Object.entries(newFolder)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body` }
                })
            }
        }
        FolderService.insertFolder(
            req.app.get('db'),
            newFolder
        )
        .then(folder => {
           res
            .status(201)
            .location(`/folders/${folder.id}`)
            .json(folder)
        })
        .catch(next)

    })

folderRouter
    .route('/:folder_id')
    .all((req, res, next) => {
        FolderService.getById(
            req.app.get('db'),
            req.params.folder_id
        )
        .then(folder => {
            if (!folder) {
                return res.status(404).json({
                    error: { message: `Folder doesn't exist` }
                })
            }
            res.folder = folder // save the Folder for the next middleware
            next() // don't forget to call next so the next middleware happens!
        })
        .catch(next)
    })
    .get((req, res, next) => {
        const knex = req.app.get('db')
    
        FolderService.getById(knex, req.params.folder_id)
        .then(folder => {
            if (!folder) {
                return res.status(404).json({
                    error: { message: `Folder doesn't exist` }
                })
            }
            res.json(folder)
        })
        .catch(next)

    })
    .delete((req, res, next) => {
        FolderService.deleteFolder(
            req.app.get('db'),
            req.params.folder_id
        )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
    })

module.exports = folderRouter