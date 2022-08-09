const savedText = {};
function deleteNote(id) {
    fetch(`/?id=${id}`, { method: 'DELETE' })
        .then(res => window.location = res.url);
}

function editNote(id, btn) {
    const els = getNoteElements(id, btn);
    const { container, noteText } = els;
    savedText[id] = noteText;
    const input = editInput(noteText.innerText);
    container.replaceChild(input, noteText);
    setBtnGroup(container, 'btn-edit');
}

function saveEdit(id, btn) {
    const els = getNoteElements(id, btn);
    const { container, noteEdit, noteText } = els;
    revertEdit(els);
    noteText.innerText = noteEdit.value;
    setBtnGroup(container, 'btn');

    fetch('/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, note: noteEdit.value })
    })
}

function undoEdit(id, btn) {
    const els = getNoteElements(id, btn);
    const { container } = els;
    revertEdit(els);
    setBtnGroup(container, 'btn');
}

function editInput(Text) {
    const input = document.createElement('input');
    input.classList.add('note-edit');
    input.type = 'text';
    input.value = Text;
    return input;
}

function getNoteElements(id, btn) {
    const container = btn.parentElement.parentElement;
    const noteEdit = container.querySelector('.note-edit');
    if (noteEdit) { return { container, noteEdit, noteText: savedText[id] } } else {
        return { container, noteText: container.querySelector('.note-text') }
    }
}

function revertEdit(els) {
    const { container, noteEdit, noteText } = els;
    container.replaceChild(noteText, noteEdit);
}

function setBtnGroup(container, group) {
    container.querySelectorAll('.buttons>button').forEach(btn => btn.classList.add('hidden'));
    container.querySelectorAll(`.${group}`).forEach(btn => btn.classList.remove('hidden'));
}