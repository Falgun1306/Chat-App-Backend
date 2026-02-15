import Conversation from '../Models/conversation.model.js'
import Message from '../Models/message.model.js'
import { getSocketId, io } from '../Socket/socket.js'
import {asyncHandler} from '../utilities/asyncHandler.utility.js'
import {errorHandler} from '../utilities/errorHandler.utility.js'

export const sendMessage = asyncHandler(async (req, res, next)=>{
     const senderId = req.user._id;
     const receiverId = req.params.receiverId; //req.params = to access routes parameters
     const message = req.body.message;

     if(!senderId || !receiverId || !message){
        return next(new errorHandler("All fields are required", 400));
     }

     //if conversation exist between the sender and reciver 
     let conversation = await Conversation.findOne({
        participants: {$all: [senderId, receiverId]},
        //$all means senderId, receiverId both are required
     });

     //if conversation does not exist between the sender and reciver
     if(!conversation){
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
        })
     }

     const newMessage = await Message.create({
        senderId,
        receiverId,
        message
     });

     if(newMessage){
        conversation.messages.push(newMessage._id);// Conversation model messages recievType is Id
        await conversation.save();
     }

     //socket.io code
     const socketId = getSocketId(receiverId);
     io.to(socketId).emit("newMesaage", newMessage);

     res
     .status(200)
     .json({
        success: true,
        responseData: newMessage,
     })

})

export const getMessages = asyncHandler(async(req, res, next)=>{
    const myId = req.user._id;
    const otherParticipantsId = req.params.otherParticipantsId;

    if(!myId || !otherParticipantsId){
        return next(new errorHandler("All fields are required", 400));
    }

    const conversation = await Conversation.findOne({
        participants: {$all: [myId, otherParticipantsId]}
    }).populate("messages"); //here messages is the field of conversation

    res
    .status(200)
    .json({
        success: true,
        responseData:{
            conversation,
        }
    })
})