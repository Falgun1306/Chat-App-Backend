import { log } from 'console';
import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import http from 'http';
import {Server} from 'socket.io'

const app = express();
const server = http.createServer(app);

const userSocketMap = {
    //userId: socketId
}

const io = new Server(server,{
    cors:{
        origin: process.env.CLIENT_URL
    }
});


io.on("connection", (socket) => {
   const userId = socket.handshake.query.userId; //handshake means backend find the online userId 
   
   userSocketMap[userId] = socket.id;
    
    // console.log(`before: ${Object.keys(userSocketMap)}`);

    io.emit("onlineUsers",Object.keys(userSocketMap));

    //on the socket disconnect we are reseting the onlineUser and send back the list
    socket.on("disconnect",()=>{
        delete userSocketMap[userId];
        io.emit("onlineUsers",Object.keys(userSocketMap));
        // console.log("a user gone");
        // console.log(`after: ${Object.keys(userSocketMap)}`);
    })
    
});

const getSocketId = (userId) =>{
    return userSocketMap[userId];
}

export {io, app, server, getSocketId}



