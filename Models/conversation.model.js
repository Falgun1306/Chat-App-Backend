import mongoose from 'mongoose';

// we are creating this as chat history occured between users
const conversationSchema = new mongoose.Schema({
    //array of objects users
    participants:[
       {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
       }
    ],
    //array of objects messages
    messages:[
       {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
       }
    ]
  },
  {timestamps: true}
);

export default mongoose.model("Conversation", conversationSchema);