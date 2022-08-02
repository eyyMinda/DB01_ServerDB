import express from "express";
import handlebars from "express-handlebars";
import mysql from 'mysql2';
import mainPage from './lib/mainPage.js';

const app = express();
const port = 8080;
app.use(express.static('public'));

app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs'
}));

app.get('/', mainPage);

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'classicmodels',
    user: 'eyyMinda',
    password: '123456789'
})

app.get('/db', (req, res) => {
    connection.execute('SELECT productLine, textDescription FROM productlines', (err, rows) => {
        const data = rows.map(row => row);
        res.render('db', { data: data });
    });
})


app.listen(port, () => console.log(`Starting server on http://localhost:${port}`));
