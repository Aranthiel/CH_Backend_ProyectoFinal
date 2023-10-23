import { chatModel } from "../../dao/mongoManagers/models/chat.model.js";

const names =[];
const messages=[];

export function initializeChat(socket, eventToRecive) {
    console.log('chatSOcket.js: ejecutando initializeChat')
    // Agrega un listener para el evento "newChatUser"
    const event = eventToRecive.evento;
    const data = eventToRecive.data;
    console.log('event', event)
    if(event=== "newChatUser") {
        console.log("event=== newChatUser")
        console.log(data);

        //socket.broadcast.emit('newChatUserBroadcast', data);
        const newChatUserBroadcastEvent = {
            tipo:'socket.broadcast',
            evento: "newChatUser",
            data: data,
        };
        
        console.log('newChatUserBroadcast emitido desde socketserver');
        console.log(newChatUserBroadcastEvent);
        return newChatUserBroadcastEvent;
    };
    

    // Agrega un listener para el evento "newChatMessage"
    if(event === "newChatMessage"){
        console.log("event=== newChatMessage")
        //console.log(data);
        //console.log('newChatMessage recibido en chatSocket');
        //console.log('Mensaje recibido:', data);

        const newMessage = new chatModel({
            name: data.name,
            message: data.message
        });
        console.log('newMessage', newMessage);

        newMessage.save()
            .then(savedMessage => {
                console.log('Mensaje guardado con éxito. ID:', savedMessage._id);
                messages.push(data);

                //socketServer.emit('chatMessages', messages);
                const chatMessagesEvent = {
                    tipo:'socketServer.emit',
                    evento: "chatMessages",
                    data: messages,
                };
                console.log('chatMessages emitido desde chatSocket.js');
                console.log(chatMessagesEvent);
                return chatMessagesEvent;
            })
            .catch(error => {
                console.error('Error al guardar el mensaje:', error);
            });
    };

    if(event === null){        
        const nullEvent = {
            tipo: null,
            evento: null,
            data: null,
        };
        console.log('nullEvent emitido desde chatSocket.js');
        console.log(nullEvent);
        return nullEvent;
    };

}
