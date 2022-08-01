import express from "express";
import handlebars from "express-handlebars";
import mysql from 'mysql2';

const app = express();
const port = 8080;

app.use(express.static('public'));
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    layoutsDir: 'views/layouts',
    extname: 'hbs'
}));

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'classicmodels',
    user: 'eyyMinda',
    password: '123456789'
})

app.get('/', (req, res) => res.render('index'));
app.get('/db', (req, res) => {
    connection.execute('SELECT productLine, textDescription FROM productlines', (err, rows) => {
        const data = rows.map(row => [row.productLine + "  ---  ", row.textDescription]);
        res.render('db', { data: data });
    });
})
app.listen(port, () => console.log(`Starting server on http://localhost:${port}`));
