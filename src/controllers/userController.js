import connection from '../config/db.js';
import {nanoid} from 'nanoid'; 

export async function showUrl(req, res) {
    const userId = res.locals.userId;
    const body = req.body;

    try {
        
        const shortUrl = nanoid(8);

        await connection.query('INSERT INTO urls (url, "shortUrl", "userId") VALUES ($1, $2, $3)', [body.url, shortUrl, userId]);

        res.status(201).send({shortUrl});

    } catch (error) {
        res.status(500).send(error)
    }

}

export async function getUrlById (req, res){
    const tokenUrl = res.locals.url[0];
    try{     
        delete tokenUrl.userId;
        delete tokenUrl.visitCount;
        delete tokenUrl.createdAt;
        res.status(200).send(tokenUrl);
    }catch (error) {
        res.status(500).send(error)
    }
}

export async function showShortUrl(req, res) {
    const body = res.locals.body;

    try {
        
        connection.query(`UPDATE urls SET "visitCount" = "visitCount" +1 WHERE "shortUrl" = $1`, [body[0].shortUrl]);

        res.redirect(body[0].url);

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function deleteUrl(req, res){
    const {id} = req.params;

    try {
        
        await connection.query('DELETE FROM urls WHERE id= $1', [id]);

        res.staus(204).send('url deletada com sucesso')

    } catch (error) {
        res.status(500).send(error)
    }
}

export async function showUser(req, res) {
    const userId = res.locals.userId;

    try {

        const {rows: userUrl} = await connection.query(`
        SELECT users.id as id, users.name as name, SUM(view) as visitCount, 
        json_agg(
            json_build_object(
                'id', urls.id,
                'shortUrl', urls."shortUrl",
                'url', urls.url,
                'visitCount', urls.view
            )
        )as "shortNewUrls"
        FROM urls JOIN users ON urls."userId" = users.id WHERE users.id = $1 GROUP BY users.id
        `, [userId]);

        res.status(200).send(userUrl[0]);
        
    } catch (error) {
        res.status(500).send(error)
    }
}

export async function showRankingUrl(req,res) {
    try {
        
        const {rows: rankings} = await connection.query(`
        SELECT users.id as id, users.name as name, COUNT(urls) as "visitLinks", COALESCE(SUM(view), 0) as "visitCount"
        FROM users LEFT JOIN urls ON users.id = ulrs."userId" 
        GROUP BU users.id
        ORDER BY "visitCount" DESC
        LIMIT 10
        `);
        res.status(200).send(rankings)

    } catch (error) {
        res.status(500).send(error)
    }
}