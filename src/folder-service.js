const FolderService = {
    getAllFolders(knexInstance) {
        return knexInstance.select('*').from('noteful_folders')
    }
}

module.exports = FolderService