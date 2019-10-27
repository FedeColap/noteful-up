require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const FolderService = require('./Folder/folder-service')
const NoteService = require('./Note/note-service')

const app = express()


const morganOption = (NODE_ENV === 'production')? 'tiny': 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Fede, Speranza e Carita')
})

app.get('/folders', (req, res, next) => {
    const knexInstance = req.app.get('db')
    FolderService.getAllFolders(knexInstance)
        .then(articles => {
            res.json(articles)
        })
        .catch(next)
})

module.exports = app;