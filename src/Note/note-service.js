const NoteService = {

    getAllNotes(knexInstance) {
        return knexInstance.select('*').from('noteful_notes')
    },

    insertNote(knexInstance, newNote) {
        return knexInstance
                    .insert(newNote)
                    .into('noteful_notes')
                    .returning('*')
                    .then(rows => {
                        return rows[0]
                    })
    },

    getById(knexInstance, id) {
        return knexInstance
                .from('noteful_notes')
                .select('*')
                .where('id', id)
                .first()
    },

    deleteNote(knexInstance, id) {
        return knexInstance
            .from('noteful_notes')
            .where({ id })
            .delete()
    },

    updateNote(knexInstance, id, newNoteFields) {
        return knexInstance
            .from('noteful_notes')
            .where({ id })
            .update(newNoteFields)
    },
}

module.exports = NoteService