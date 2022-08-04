import mysql from 'mysql2';

export function renderMainPage(req, res) {
    const model = {};
    model.title = 'To-Do App';

    const connection = connect();
    Promise.resolve()
        .then(_ => getNotes(connection))
        .then(notes => ({ ...model, notes }))
        .then(model => res.render('index', { model }))
        .catch(err => {
            res.render('error', { model: { errorName: err.name, message: err.message, stack: err.stack } });
        });

}

function connect() {
    return mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'todoapp',
        password: '123456789',
        database: 'todoapp'
    });
}

export function insertNewNote(req, res) {
    const newNote = req.body.note;
    Promise.resolve()
        .then(_ => saveNote(connect(), newNote))
        .then(_ => res.redirect('/'))
        .catch(err => {
            res.render('error', { model: { errorName: err.name, message: err.message, stack: err.stack } });
        });
}

export function deleteNote(req, res) {
    const id = req.query.id;
    Promise.resolve()
        .then(_ => deleteNoteById(connect(), id))
        .then(_ => res.redirect(303, '/'))
        .catch(err => {
            res.render('error', { model: { errorName: err.name, message: err.message, stack: err.stack } });
        });
}

export function editNote(req, res) {
    const id = req.query.id;
    const note = req.body.note;
    Promise.resolve()
        .then(_ => saveNoteChanges(connect(), id, note))
        .then(_ => res.status(202).send())
        .catch(err => {
            res.status(404).send();
        });
}

async function getNotes(connection) {
    return await new Promise((resolve, reject) => {
        connection.execute('SELECT note_id, note from notes', (err, rows) => {
            if (err) return reject(err);
            const notes = rows;
            console.log(notes)
            return resolve(notes);
        })
    });
}

async function saveNote(connection, note) {
    return await new Promise((resolve, reject) => {
        connection.execute('INSERT notes(note) VALUES(?)', [note], (err, _) => {
            if (err) return reject(err);
            resolve();
        });
    });
}
async function saveNoteChanges(connection, note, noteId) {
    return await new Promise((resolve, reject) => {
        connection.execute('UPDATE notes SET note=? WHERE noteId=?', [note, noteId], (err, _) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

async function deleteNoteById(connection, noteId) {
    return await new Promise((resolve, reject) => {
        connection.execute('DELETE FROM notes WHERE note_id = ?', [noteId], (err, _) => {
            if (err) return reject(err);
            resolve();
        });
    })
}