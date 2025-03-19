const { Conversation } = require("../models/Conversation")

const getConversation = async(currentUserId)=>{
    if(currentUserId){
        const currentUserConversation = await Conversation.find({
            "$or" : [
                { sender : currentUserId },
                { receiver : currentUserId}
            ]
        }).sort({  updatedAt : -1 }).populate('message').populate('sender').populate('receiver')

        const conversation = currentUserConversation.map((con)=>{
            const countUnseenMsg = con?.message?.reduce((prev,curr) => {
                const msgByUserId = curr?.msgByUserId?.toString()

                if(msgByUserId !== currentUserId){
                    return  prev + (curr?.seen ? 0 : 1)
                }else{
                    return prev
                }
             
            },0)
            
            return{
                _id : con?._id,
                sender : con?.sender,
                receiver : con?.receiver,
                unseenMsg : countUnseenMsg,
                lastMsg : con.message[con?.message?.length - 1]
            }
        })

        return conversation
    }else{
        return []
    }
}

module.exports = getConversation










// if(currentUserId){
//     const currentUserConversation = await Conversation.find({
//         "$or" : [
//             { sender : currentUserId },
//             { receiver : currentUserId}
//         ]
//     }).sort({  updatedAt : -1 }).populate('message').populate('sender').populate('receiver')


//     // console.log('currentUserConversation',currentUserConversation)

//     const conversation = currentUserConversation.map((con)=>{

//         const countUnseenMsg = con?.message?.reduce((prev,curr) => {
//             const msgByUserId = curr?.msgByUserId?.toString()

//             if(msgByUserId !== currentUserId){
//                 return  prev + (curr?.seen ? 0 : 1)
//             }else{
//                 return prev
//             }
        
//         },0)
        
//         return{
//             _id : con?._id,
//             sender : con?.sender,
//             receiver : con?.receiver,
//             unseenMsg : countUnseenMsg,
//             lastMsg : con.message[con?.message?.length - 1]
//         }
//     })

    
//     socket.emit('conversation',conversation)    
// }