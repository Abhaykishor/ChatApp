const express = require('express')
require('dotenv').config();
const {Server} = require ('socket.io')
const  http = require('http')
const GetUserDetails = require('../helper/GetUserDetails')
const UserModel = require('../models/UserModel')
const {Conversation,Message} = require('../models/Conversation')
const getConversation = require('../helper/getConversation')
// const getConversation = require('../helper/getConversation')

const app = express()


const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST'],
        credentials: true
    }
})

const onlineUser = new Set()

io.on('connection',async(socket) =>{
    console.log('connect user', socket.id)

    const token = socket.handshake.auth.token

    //current user details
    const user  = await GetUserDetails(token)
    // console.log("user",user )

    //create a room 
    socket.join(user?._id?.toString())
    onlineUser.add(user?._id?.toString())

    io.emit('onlineUser',Array.from(onlineUser))



    socket.on('message-page',async(userId)=>{
        // console.log("userId", userId)
        const userDetails = await UserModel.findById(userId).select("-password")

        const payload = {
            _id : userDetails?._id,
            name : userDetails?.name,
            email : userDetails?.email,
            profile_pic : userDetails?.profile_pic,
            online : onlineUser.has(userId)
        }
        socket.emit('message-user',payload)


        //get previous message
        const getConversationMessage = await Conversation.findOne({
            "$or" : [
                { sender : user?._id, receiver : userId },
                { sender : userId, receiver :  user?._id}
            ]
        }).populate('message').sort({ updatedAt : -1 })

        socket.emit('message',getConversationMessage?.message || [])

    })

   


    //new message
    socket.on('new message',async (data)=>{

        // check possible conversation or not
        let conversation = await Conversation.findOne({
            "$or" :  [
                { sender : data?.sender, receiver : data?.receiver },
                { sender : data?.receiver, receiver :  data?.sender}
            ]
        })
        // console.log('conversation',conversation)


        // if conversation not available
        if(!conversation){
            const createConversation  = await Conversation({
                sender: data?.sender,
                receiver: data?.receiver
            })
            conversation = await createConversation.save()
        }

        const message = new Message ({
          text : data.text,
          imageUrl : data.imageUrl,
          videoUrl : data.videoUrl,
          msgByUserId : data?.msgByUserId
        })
        const saveMessage = await message.save() 

        const updateConversation = await Conversation.updateOne({_id: conversation?._id},{
            "$push" : {message: saveMessage?._id}
        })

        const getConversationMessage = await Conversation.findOne({
            "$or" : [
                { sender : data?.sender, receiver : data?.receiver },
                { sender : data?.receiver, receiver :  data?.sender}
            ]
        }).populate('message').sort({updatedAt :-1})

        io.to(data?.sender).emit('message',getConversationMessage?.message || [])
        io.to(data?.receiver).emit('message',getConversationMessage?.message ||[])

        // console.log('new message',data)
        // console.log('conversation',conversation)



        //send conversation
        const conversationSender = await getConversation(data?.sender)
        const conversationReceiver = await getConversation(data?.receiver)
        
        io.to(data?.sender).emit('conversation',conversationSender)
        io.to(data?.receiver).emit('conversation',conversationReceiver)


    })


    //seen on message
    socket.on('seen',async(msgByUserId)=>{
        let conversation = await Conversation.findOne({
            "$or" :  [
                { sender : user?._id, receiver :msgByUserId },
                { sender : msgByUserId, receiver :  user?._id}
            ]
        })

        const conversationMessageId = conversation?.message||[]
        const updateMessage = await Message.updateMany(
            { _id: {"$in": conversationMessageId}, msgByUserId : msgByUserId},
            {"$set" : {seen : true}}
        )

        const conversationSender = await getConversation(user?._id?.toString())
        const conversationReceiver = await getConversation(msgByUserId)
        
        io.to(user?._id?.toString()).emit('conversation',conversationSender)
        io.to(msgByUserId).emit('conversation',conversationReceiver)


    })


    //sidebar
    socket.on('sidebar',async(currentUserId)=>{
        console.log("current user",currentUserId)

        const conversation = await getConversation(currentUserId)
        socket.emit('conversation',conversation)
        
    })



    // disconnect
    socket.on('disconnect',()=>{
        onlineUser.delete(user?._id)
        console.log('disconnect user', socket.id)
    })

})

module.exports = {
    app,
    server
}












