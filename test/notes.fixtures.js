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

function makeMaliciousNote() {
    const maliciousNote = {
      id: 911,
      n_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
      modified: new Date(),
      folderid: 2,
      content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
    }
    const expectedNote = {
      ...maliciousNote,
      n_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return {
      maliciousNote,
      expectedNote,
    }
}

module.exports = {
    makeNotesArray,
    makeMaliciousNote
}