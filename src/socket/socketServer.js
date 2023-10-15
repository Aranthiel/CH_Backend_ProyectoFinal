import { Server } from 'socket.io'; // Para gestionar las conexiones de WebSocket
//para intereactuar con los productos
import { getAllProductsC,
    getProductByIdC,
    addProductC,
    updateProductC,
    deleteProductC,} from '../controller/products.controller.js';
import { chatModel } from "../dao/mongoManagers/models/chat.model.js";

let socketServer;
export function initializeSocket(server) {
    socketServer = new Server(server)

    const names =[];
    const messages=[];

    // connection - disconnect
// eventos predeterminados de socket.io  
socketServer.on("connection", async (socket) =>{
    console.log (`se ha conectado el cliente ${socket.id}`);

    //productos iniciales
    try {
        const productosIniciales = await getAllProductsC();
        console.log('productosIniciales en socketserver', productosIniciales)
        socket.emit("productosIniciales", productosIniciales);
    } catch (error) {
        console.error("Error al obtener productos iniciales:", error);
    }
    


    //chat
    socket.on("newChatUser", (user)=>{
        socket.broadcast.emit('newChatUserBroadcast', user)
    });
    
    socket.on("newChatMessage", (info) => {
        console.log('Mensaje recibido:', info);
        
        const newMessage = new chatModel({
            name: info.name,
            message: info.message
        });
    
        console.log('Nuevo mensaje a guardar:', newMessage);
    
        newMessage
            .save()
            .then(savedMessage => {
                console.log('Mensaje guardado con éxito. ID:', savedMessage._id);
                messages.push(info);
                socketServer.emit('chatMessages', messages);
            })
            .catch(error => {
                console.error('Error al guardar el mensaje:', error);
            });
    });
    

    //RealTimeProducts
  
    //agrega un nuevo producto usando  el controlador
    socket.on('addProduct', async (nProduct) => {
        console.log('Evento "addProduct" recibido en el servidor con los siguientes datos:', nProduct);
        
        // agrega el nuevo producto usando el controlador
        const productoAgregado = await addProductC(nProduct);
        console.log(productoAgregado);
        console.log(productoAgregado.success);

        if (productoAgregado.success) {
            // Emite la lista actualizada de productos a todos los clientes
            const productosActualizados = await getAllProductsC();
            socketServer.emit('productsUpdated', productosActualizados);
        } else {
            console.log('No se pudo agregar el producto');
        }
    });

    socket.on('borrar', async (selectedProductIds) => {
        console.log('Evento "borrar" recibido en el servidor con los siguientes datos:', selectedProductIds);
        try {
            for (const productId of selectedProductIds) {
                const result = await deleteProductC(productId);
                console.log(result.message);
            }
            console.log('Todas las eliminaciones se completaron con éxito');
            const productosActualizados = await getAllProductsC();
            socketServer.emit('productsUpdated', productosActualizados);
        } catch (error) {
            console.error('Error durante la eliminación:', error);
        }
    });
    
    

    socket.on("disconnect", () =>{
        console.log(`cliente desconectado ${socket.id}`)
    })
});
};



