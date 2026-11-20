import 'dotenv/config';
import express, { Router } from 'express'
import userRouter from './routers/userRouter';
import listingRouter from './routers/listingRouter';
import helmet from "helmet";

const app = express();
// Exactly one trusted hop (the Next.js rewrite proxy) so req.ip is the real client IP.
// Do not use `true`: then any client could spoof its IP via X-Forwarded-For.
app.set("trust proxy", 1);
app.use(helmet()); 

app.use(express.json({limit: "10kb"}));

app.use("/user", userRouter);
app.use("/listings", listingRouter);



app.listen(3000, () =>{
    console.log("Сервер запущено на 3000 порті");
});
