import express from 'express';
import cors from'cors';
import dotenv from 'dotenv';
import { dbConnection } from './db.js';
import { userRouter } from './Routes/User.js';


//ENV configuration
dotenv.config();

let app=express();
let PORT=process.env.PORT;

//Middlewares
app.use(express.json());
app.use(cors());

//Connecting DB
dbConnection();

//routes
app.use("/api/user",userRouter);

//server connection
app.listen(PORT,()=>console.log(`Server listening on ${PORT}`));