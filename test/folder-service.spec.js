const knex = require('knex')
const FolderService = require('../src/Folder/folder-service')

describe(`Folders service object`, function() {

    let db

    let testFolders = [
        {   
            id: 1,
            f_name: 'Primo'
        },
        {
            id: 2,
            f_name: 'Secondo'
        },
        {
            id: 3,
            f_name: 'Terzo'
        },
        {
            id: 4,
            f_name: 'Quarto'
        },
    ]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    after(() => db.destroy())

    before(() => db('noteful_folders').truncate())

    afterEach(() => db('noteful_folders').truncate())

    describe(`getAllFolders()`, () => {

        context(`Given 'noteful_folders' has data`, () => {

            beforeEach(() => {
                return db
                    .into('noteful_folders')
                    .insert(testFolders)
            })

            it(`getAllFolders() resolves all folders from 'noteful_folders' table`, () => {
                // test that FolderService.getAllFolders gets data from table
                return FolderService.getAllFolders(db)
                 .then(actual => {
                     expect(actual).to.eql(testFolders)
                 })
            })
            it(`deleteFolder() removes a older by id from 'noteful_folders' table`, () => {
                const folderId = 3
                return FolderService.deleteFolder(db, folderId)
                .then(() => FolderService.getAllFolders(db))
                .then(allFolders => {
                 // copy the test articles array without the "deleted" article
                const expected = testFolders.filter(folder => folder.id !== folderId)
                expect(allFolders).to.eql(expected)
                })
            })

        })

        context(`Given 'noteful_folders' has no data`, () => {

            it(`getAllFolders() resolves an empty array`, () => {
            return FolderService.getAllFolders(db)
                .then(actual => {
                    expect(actual).to.eql([])
                })
            })

            it(`insertFolder() inserts a new folder and resolves the new folder with an 'id'`, () => {
                const newFolder = {
                    f_name: 'Nuovo folder',
                } 
        
                return FolderService.insertFolder(db, newFolder)
                    .then(actual => {
                        expect(actual).to.eql({
                            id: 1,
                            f_name: newFolder.f_name
                        })
                    })
            })

        })
        
    })

    
})



describe(`together they clash`, function() {
    let db

    let testFolders = [
        {   
            id: 1,
            f_name: 'Primo'
        },
        {
            id: 2,
            f_name: 'Secondo'
        },
        {
            id: 3,
            f_name: 'Terzo'
        },
        {
            id: 4,
            f_name: 'Quarto'
        },
    ]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
    })

    after(() => db.destroy())

    before(() => db('noteful_folders').truncate())
    

    afterEach(() => db('noteful_folders').truncate())
    

    beforeEach(() => {
        return db
            .into('noteful_folders')
            .insert(testFolders)
    })
    it(`getById() resolves a folder by id from 'noteful_folders' table`, () => {
            
    
        const folderId = 3
        const expectedFolder = testFolders[folderId - 1]
        
        return FolderService.getById(db, folderId)
            
            .then(actual => {
                expect(actual).to.eql({
                    id: folderId,
                    f_name: expectedFolder.f_name
                })
            })
    })

    it(`updateFolder() updates a folder from the 'noteful_folders' table`, () => {
        const idOfFolderToUpdate = 3
        const newFolderData = {
            f_name: 'updated name',
        }
            return FolderService.updateFolder(db, idOfFolderToUpdate, newFolderData)
               .then(() => FolderService.getById(db, idOfFolderToUpdate))
               .then(folder => {
                expect(folder).to.eql({
                   id: idOfFolderToUpdate,
                   ...newFolderData,
                })
               })
    })
})


