function makeNotesArray() {
    return [
        {   
            id: 1,
            n_name: 'Prima nota',
            modified:'2029-01-22T16:28:32.615Z',
            folderid: 1,
            content: 'Testo a caso'
        },
        {
            id: 2,
            n_name: 'Seconda nota',
            modified: '2100-05-22T16:28:32.615Z',
            folderid: 1,
            content: 'Testo a caso'
        },
        {
            id: 3,
            n_name: 'Terza nota',
            modified: '1919-12-22T16:28:32.615Z',
            folderid: 1,
            content: 'Testo a caso'
        },
        {
            id: 4,
            n_name: 'Quarta nota',
            modified: '2028-01-22T16:28:32.615Z',
            folderid: 1,
            content: 'Testo a caso'
        },
    ]
}

module.exports = {
    makeNotesArray,
}