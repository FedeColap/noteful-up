require('dotenv').config()
const knex = require('knex')
const FolderService = require('./Folder/folder-service')
const NoteService = require('./Note/note-service')

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL,
})

console.log(FolderService.getAllFolders(knexInstance))