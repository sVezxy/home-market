import express, { Router } from 'express'
import userRouter from './routers/userRouter';
import 'dotenv/config';

const app = express();

app.use(express.json());

app.use("/user", userRouter);



app.listen(3000, () =>{
    console.log("Сервер запущено на 3000 порті");
});
