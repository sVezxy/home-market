import express, { Router } from 'express'
import userRouter from './routers/userRouter';
import listingRouter from './routers/listingRouter';
import 'dotenv/config';

const app = express();

app.use(express.json({limit: "10kb"}));

app.use("/user", userRouter);
app.use("/listings", listingRouter);



app.listen(3000, () =>{
    console.log("Сервер запущено на 3000 порті");
});
