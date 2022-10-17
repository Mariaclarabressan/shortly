import {userSchema} from '../schemas/userSchema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connection from '../config/db.js';

dotenv.config()

export async function tokenAuthorizationMiddleware(req, res, next) {

    const {checkToken} = req.headers;

    if(!checkToken) {
        return res.status(401).send('token não encontrado');
    }

    const token = authorization?.replace('Bearer' , '');
    await jwt.verify(token, process.env.MODE, function (error, acept){
        if(error){
            return res.status(401).send('erro ao decodificar o token');
        }

        res.locals.userId = acept.id;

        next();
    })
}

export async function creatUrlMiddleware(req, res, next) {
    const body = req.body;
    const {error} = userSchema.validate(body, {abortEarly: false});

    if(error) {
        return res.status(422).send(error);
    }

    next();
}

export async function showUrlMiddleware(req, res, next) {
    const {url} = req.params;

    const {rows: checkUrl} = await connection.query('SELECT * FROM urls WHERE "shorturl" = $1', [url]);

    if(!checkUrl[0]) {
        return res.status(404).send('Url não existe');
    }

    res.locals.url = checkUrl[0];

    next();
}

export async function showShortUrlMiddleware(req, res, next) {
    const {newUrl} = req.params;

    const {rows: checkNewUrl} = await connection.query('SELECT * FROM urls WHERE "shorturl" = $1', [newUrl]);

    if(!checkNewUrl[0]) {
        return res.status(404).send('Url não existe');
    }

    res.locals.body = checkNewUrl[0];

    next();
}

export async function deleteUrlMiddleware(req, res, next) {
    const {id} = req.params;
    const userId = res.locals.userId;

    const {rows: checkId} = await connection.query('SELECT * FROM urls WHERE "shorturl" = $1', [id]);

    if(!checkId[0]) {
        return res.status(404).send('Id não existe');
    }

    const {rows: checkUrlUser} = await connection.query('SELECT * FROM urls WHERE urls.id = $1 AND urls."userId" = $2', [Number(id), userId]);

    if(!checkUrlUser[0]){
        return res.status(401).send('Url não existe')
    }
    
    next();
}

export async function showUserMiddleware(req, res, next) {
    const userId = res.locals.userId;

    const {rows: checkUser} = await connection.query('SELECT * FROM users WHERE id = $1', [userId]);

    if(!checkUser[0]){
        return res.status(404).send('erro ao mostrar usuário')
    }

    next();
}
