function makeFoldersArray() {
    return [
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
}

function makeMaliciousFolder() {
    const maliciousFolder = {
      id: 911,
      f_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    }
    const expectedFolder = {
      ...maliciousFolder,
      f_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    }
    return {
      maliciousFolder,
      expectedFolder,
    }
}

module.exports = {
    makeFoldersArray,
    makeMaliciousFolder
}