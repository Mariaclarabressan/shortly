import connection from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function creatUser(req,res) {
    const body = req.body;

    console.log(body)

    const SALT = 10

    const criptPassword = bcrypt.hashSync(body.password, SALT);

    console.log(body.password)

    try {
        
        connection.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [body.name, body.email, criptPassword]);
        res.sendStatus(201);

    } catch (error) {
        res.status(500).send(error)
    }
}

export async function loginUser(req,res) {
    const id = res.local.id;

    try {

        const token = jwt.sign({id}, process.env.MODE, {
            expiresIn: 1000
        });

        res.status(200).send(token)
        
    } catch (error) {
        res.status(500).send('não possível logar')
    }
}
