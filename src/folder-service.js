const FolderService = {

    getAllFolders(knexInstance) {
        return knexInstance.select('*').from('noteful_folders')
    },

    insertFolder(knexInstance, newFolder) {
        return knexInstance
                    .insert(newFolder)
                    .into('noteful_folders')
                    .returning('*')
                    .then(rows => {
                        return rows[0]
                    })
    },

    getById(knexInstance, id) {
        return knexInstance
                .from('noteful_folders')
                .select('*')
                .where('id', id)
                .first()
    },
}

module.exports = FolderService