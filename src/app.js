require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const folderRouter = require('./Folder/folder-router')
const noteRouter = require('./Note/note-router')

const app = express()

const morganOption = (NODE_ENV === 'production')? 'tiny': 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/folders', folderRouter)
app.use('/api/notes', noteRouter)


app.get('/', (req, res) => {
    res.send('Fede, Speranza e Carita')
})


module.exports = app;