import express from "express";
import handlebars from "express-handlebars";
import { getNotes, addNote, deleteNote, updateNote } from './src/routes.js';
import { handleLogin, handleReg, login, register, } from './src/user-routes.js';

const app = express();
const port = 8080;
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({ extname: 'hbs' }));

app.get('/', getNotes);
app.post('/', addNote);
app.delete('/', deleteNote);
app.patch('/', updateNote);

app.get('/register', register);
app.post('/register', handleReg);
app.get('/login', login);
app.post('/login', handleLogin);

app.listen(port, () => console.log(`Starting server on http://localhost:${port}`));
