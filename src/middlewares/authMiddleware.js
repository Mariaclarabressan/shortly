import {loginSchema, creatSchema} from '../schemas/authSchema.js';
import connection from '../config/db.js';
import bcrypt from 'bcrypt';

export async function userMiddleware(req, res, next) {
    const body = req.body;
    console.log(body)

    const {error} = creatSchema.validate(body, {abortyEarly: false});
    console.log(error)
    if(error) {
        return res.status(422).send(error);
    }

    const {rows : checkEmail} =  await connection.query('SELECT * FROM users WHERE email = $1;', [body.email]);


    if(checkEmail[0]){
        console.log(checkEmail)
        return res.sendStatus(409);
    }

    next();
}

export async function loginMiddleware(req, res, next) {
    const body = req.body;

    const {error} = loginSchema.validate(body, {abortEarly: false});

    if(error) {
        return res.status(422).send(error);
    }

    const {rows: checkUser} = await connection.query('SELECT * FROM users WHERE email = $1;', [body.email]);

    const checkPassword = bcrypt.compareSync(body.password, checkUser[0].password);

    if(!checkUser[0] || !checkPassword) {
        return res.status(401).send('usuário ou senha errados')
    }

    res.locals.id = checkUser[0].id

    next();
}