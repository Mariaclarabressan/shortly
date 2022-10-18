import { userSchema } from '../schemas/userSchema.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import connection from '../config/db.js';

dotenv.config()

export async function tokenMiddleware(req, res, next) {

    const token = req.headers.authorization?.replace('Bearer', '').trim();

    let userId;

    try {
        userId = jwt.verify(token, process.env.TOKEN_SECRET).userId;

    } catch (error) {

        connection.query('DELETE FROM sessions WHERE token = $1;', [token]);

        res.sendStatus(401);

        return

    }
    try {


        const { rows: checkUser } = await connection.query('SELECT * FROM sessions WHERE id = $1;', [userId]);

        if (!checkUser[0]) {
            return res.status(404).send('erro ao mostrar usuário')
        }

        res.locals.userId = userId;

        next();

    } catch (error) {

        res.sendStatus(401);
    }

}

export async function creatUrlMiddleware(req, res, next) {
    const body = req.body;
    const { error } = userSchema.validate(body, { abortEarly: false });

    if (error) {
        return res.status(422).send(error);
    }

    next();
}

export async function showUrlMiddleware(req, res, next) {
    const { id } = req.params;

    const { rows: checkUrl } = await connection.query('SELECT * FROM urls WHERE "id" = $1', [id]);

    if (!checkUrl[0]) {
        return res.status(404).send('Url não existe');
    }

    res.locals.url = checkUrl;

    next();
}

export async function showShortUrlMiddleware(req, res, next) {
    const { shortUrl } = req.params;

    const { rows: checkNewUrl } = await connection.query('SELECT * FROM urls WHERE "shortUrl" = $1', [shortUrl]);

    if (!checkNewUrl[0]) {
        return res.status(404).send('Url não existe');
    }

    res.locals.body = checkNewUrl;

    next();
}

export async function deleteUrlMiddleware(req, res, next) {
    const { id } = req.params;
    const userId = res.locals.userId;

    const { rows: checkId } = await connection.query('SELECT * FROM urls WHERE "id" = $1', [id]);

    if (!checkId[0]) {
        return res.status(404).send('Id não existe');
    }

    const { rows: checkUrlUser } = await connection.query('SELECT * FROM urls WHERE urls.id = $1 AND urls."userId" = $2', [Number(id), userId]);

    if (!checkUrlUser[0]) {
        return res.status(401).send('Url não existe')
    }

    next();
}


