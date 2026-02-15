import {app, server} from './Socket/socket.js'
import express from 'express';
import { connectDB } from './db/connection1.db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

connectDB();


//if we use this middleware we do not need to manuallly parse the json
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes
import messageRoute from './Routes/message.router.js'
import userRoute from './Routes/user.router.js';
app.use('/api/v1/user', userRoute);
app.use('/api/v1/message', messageRoute);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

//middlewares
import { errorMiddleware } from './Middlewares/error.middleware.js';
app.use(errorMiddleware);

server.listen(3000, ()=>{
    console.log("Server is runnig on PORT 3000...");
})