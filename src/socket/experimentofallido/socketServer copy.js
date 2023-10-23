import { Server } from 'socket.io'; // Para gestionar las conexiones de WebSocket

import { initializeChat } from './chatSocket.js';
import { initializeRealTimeProducts } from './realtimeproductsSocket.js';
import { initializeCart } from './cartSocket.js';
import { initializeProducts } from './productsSocket.js';

import { chatModel } from "../../dao/mongoManagers/models/chat.model.js";

const names =[];
const messages=[];

/* function initializeChat(socket) {
    console.log('chatSOcket.js: ejecutando initializeChat')
    // Agrega un listener para el evento "newChatUser"
    socket.on("newChatUser", (user) => {
        socket.broadcast.emit('newChatUserBroadcast', user);
        console.log('newChatUserBroadcast emitido desde socketserver');
    });

    // Agrega un listener para el evento "newChatMessage"
    socket.on("newChatMessage", (info) => {
        console.log('newChatMessage recibido en socketserver');
        console.log('Mensaje recibido:', info);

        const newMessage = new chatModel({
            name: info.name,
            message: info.message
        });

        newMessage.save()
            .then(savedMessage => {
                console.log('Mensaje guardado con éxito. ID:', savedMessage._id);
                messages.push(info);
                socketServer.emit('chatMessages', messages);
                console.log('chatMessages emitido desde socketserver');
            })
            .catch(error => {
                console.error('Error al guardar el mensaje:', error);
            });
    });
} */

let socketServer;
export function initializeSocket(server) {
    console.log('Ejecutando initializeSocket de socketServer.js')
    socketServer = new Server(server)

    socketServer.on("connection", async (socket) =>{
        console.log (`se ha conectado el cliente ${socket.id}`);

        function buildApiUrl(path) {
            const baseUrl = process.env.API_BASE_URL || 'http://localhost:8080'; // Establece la URL base predeterminada
            return `${baseUrl}/api/${path}`;
        }
        // Escuchar el evento "vistaActiva" y realizar la inicialización adecuada
        socket.on("vistaActiva", ( eventToRecive) => {
            console.log(`Escuchando el evento Vista activa en socketServer.js: ${ eventToRecive.vista}`);
            switch ( eventToRecive.vista) {

                // Para la vista "chat": El path se establece en buildApiUrl('chats').
                // Para la vista "realtimeproducts": El path se establece en buildApiUrl('products?limit=100').
                // Para la vista "cart": El path se establece en buildApiUrl('carts').
                // Para la vista "products": El path se establece en buildApiUrl('products').
                case "chat":
                    const chatEventToEmit = initializeChat(socketServer,  eventToRecive);
                    console.log ('chatEventToEmit', chatEventToEmit);
                    //console.log ('chatEventToEmit.tipo', chatEventToEmit.tipo);
                    //console.log ('chatEventToEmit.tipo == "socket.broadcast"', chatEventToEmit.tipo === "socket.broadcast");
                    //console.log ('chatEventToEmit.tipo == "socket.broadcast"', chatEventToEmit.tipo === "socket.broadcast");
                    if(chatEventToEmit.tipo === "socket.broadcast"){
                        socket.broadcast.emit(chatEventToEmit.evento, chatEventToEmit.data);                        
                    } else if (chatEventToEmit.tipo == "socketServer.emit"){
                        socketServer.emit(chatEventToEmit.evento, chatEventToEmit.data);
                    } else {
                        console.log("nullEvent");
                    }
                    break;
                case "realtimeproducts":
                    const realtimeproductsURL = buildApiUrl(path);
                    initializeRealTimeProducts(socketServer, realtimeproductsURL);
                    break;
                case "cart":
                    const cartURL = buildApiUrl(path);
                    initializeCart(socketServer, cartURL);
                    break;
                case "products":
                    const productsURL = buildApiUrl(path);
                    initializeProducts(socketServer, productsURL);
                    break;
                default:
                    console.log("Vista no reconocida");
            }
        });

        socket.on("disconnect", () =>{
            console.log(`cliente desconectado ${socket.id}`)
        })
    });
};



