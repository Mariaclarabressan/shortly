import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(authRoute);
app.use(userRoute);

const port = process.env.PORT || 5001;

app.listen(port, () => {
    console.log(`Mode: ${process.env.MODE || "DEV"}`);
    console.log(`O servidor está rodando na porta ${port}`);
});