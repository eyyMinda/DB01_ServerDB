import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import * as db from './database.js';
import { connect } from './connect.js';

//send registration page
export function register(req, res) {
    let err = null;
    switch (req.query.error) {
        case 'existingUser': err = 'User already exists';
        case 'shortPassword': err = 'Password is too short';
    }
    res.render('register', { model: { err } });
}

//register user or redirect back on error
export function handleReg(req, res) {
    Promise.resolve()
        .then(_ => {
            if (req.body.password.length <= 4) {
                const error = new Error('Password too short');
                error.code = 'ER_SHORT_PASSWORD';
                throw error;
            }
        })
        .then(_ => bcrypt.hash(req.body.password, 12))
        .then(hash => db.insertUser(connect(), req.body.username, hash))
        .then(_ => res.redirect('/login'))
        .catch(err => {
            let errType;
            switch (err.code) {
                case 'ER_DUP_ENTRY': errType = 'existingUser'; break;
                case 'ER_SHORT_PASSWORD': errType = 'shortPassword'; break;
                default: console.log(err); errType = 'unknown'; break;
            }
            res.redirect(`register?error=${errType}`);
        })
}

//send login page
export function login(req, res) {
    res.render('login', { model: { hasError: req.query.error } });
}

//login user or send back on error
export function handleLogin(req, res) {
    const { username, password } = req.body;
    Promise.resolve()
        .then(_ => db.getUser(connect(), username))
        .then(async user => ([user, await bcrypt.compare(password, user.passHash)]))
        .then(async ([user, passMatch]) => {
            if (passMatch) {
                const token = uuid();
                await db.insertToken(connect(), token, user.userId).then(_ => {
                    res.cookie('authToken', token);
                    res.redirect('/');
                });
            } else {
                throw new Error('Incorrect password')
            }
        })
        .catch(err => {
            console.log(err);
            res.redirect('login?error=unknown');
        })

}