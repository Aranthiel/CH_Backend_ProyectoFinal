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

    function buildApiUrl(path) {
        const baseUrl = process.env.API_BASE_URL || 'http://localhost:8080'; // Establece la URL base predeterminada
        return `${baseUrl}/api/${path}`;
    }

    //productos iniciales

    try {
        const apiUrl = buildApiUrl('products');
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error al obtener productos: ${response.statusText}`);
        }
        const productosIniciales = await response.json();

        // Emite los productos iniciales al cliente
        socket.emit("productosIniciales", productosIniciales.products);
        console.log('Productos iniciales en socketserver', productosIniciales.products);
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
    

    // RealTimeProducts

    // Agrega un nuevo producto usando el URL
    socket.on('addProduct', async (nProduct) => {
        console.log('Evento "addProduct" recibido en el servidor con los siguientes datos:', nProduct);

        // Realiza una solicitud POST a la URL con el cuerpo nProduct
        try {
            const apiUrl = buildApiUrl('products');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nProduct),
            });

            if (response.ok) {
                // Después de agregar con éxito, obtén la lista actualizada de productos
                const updatedResponse = await fetch(apiUrl);
                if (updatedResponse.ok) {
                    const productosActualizados = await updatedResponse.json();
                    socketServer.emit('productsUpdated', productosActualizados.products);
                }
            } else {
                console.log('No se pudo agregar el producto');
            }
        } catch (error) {
            console.error('Error al agregar el producto:', error);
        }
    });



    socket.on('borrar', async (selectedProductIds) => {
        console.log('Evento "borrar" recibido en el servidor con los siguientes datos:', selectedProductIds);
    
        try {
            const productosEliminadosExitosamente = [];
            const productosNoEliminados = [];
    
            for (const productId of selectedProductIds) {
                const apiUrlDelete = buildApiUrl(`products/${productId}`);
                const deleteResponse = await fetch(apiUrlDelete, {
                    method: 'DELETE',
                });
    
                if (deleteResponse.ok) {
                    productosEliminadosExitosamente.push(productId);
                    console.log(`Producto con ID ${productId} eliminado con éxito.`);
                } else {
                    productosNoEliminados.push(productId);
                    console.error(`Error al eliminar el producto con ID ${productId}: ${deleteResponse.statusText}`);
                }
            }
    
            // Emitir eventos para productos eliminados con éxito y productos no eliminados
            if (productosEliminadosExitosamente.length > 0) {
                socketServer.emit('productsDeleted', productosEliminadosExitosamente);
            }
    
            if (productosNoEliminados.length > 0) {
                socketServer.emit('productsNotDeleted', productosNoEliminados);
            }
    
            // Obtener los productos actualizados después de la eliminación
            const apiUrlGet = buildApiUrl('products');
            const getResponse = await fetch(apiUrlGet);
    
            if (getResponse.ok) {
                const productosActualizados = await getResponse.json();
                socketServer.emit('productsUpdated', productosActualizados.products);
                console.log('Todas las eliminaciones se completaron con éxito');
            } else {
                console.error('Error al obtener productos actualizados:', getResponse.statusText);
            }
        } catch (error) {
            console.error('Error durante la eliminación:', error);
        }
    });
    
     // emitir el evento "carritosIniciales"
    try {
        const apiUrl = buildApiUrl('carts');
        const response = await fetch(apiUrl);
        console.log('getCartsC response en socketserver', response)
        if (!response.ok) {
            throw new Error(`Error al obtener carritos: ${response.statusText}`);
        }
        const carritosIniciales = await response.json();
        console.log("carritosIniciales en socket server", carritosIniciales.allCarts);

        // Emite los carritos iniciales al cliente
        if (carritosIniciales.length === 0) {
            socket.emit("carritosIniciales", []);
            console.log('carritos iniciales en socketserver', carritosIniciales);
    
        } else {
            socket.emit("carritosIniciales", carritosIniciales.allCarts);
            console.log('carritos iniciales en socketserver', carritosIniciales);
    
        }        
        } catch (error) {
        console.error("Error al obtener carritos iniciales:", error);
    }

    // Agregar un listener para el evento "crearCarrito"
    socket.on("crearCarrito", async (cartData) => {
        console.log('Evento "crearCarrito" recibido en el servidor con los siguientes datos:', cartData);
    
        try {
            // Transforma el array en un objeto con la propiedad "products"
            const requestBody = { products: cartData };
    
            const apiUrl = buildApiUrl('carts');
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody), // Debes usar JSON.stringify aquí
            });
            console.log('addCartC response en socketserver', response);
    
            if (response.ok) {
                // Después de agregar con éxito, obtén la lista actualizada de productos
                const updatedResponse = await fetch(apiUrl);
                console.log('getCartsC updatedResponse en socketserver', updatedResponse)
                if (!updatedResponse.ok) {
                    throw new Error(`Error al obtener carritos: ${response.statusText}`);
                }
                const carritosActualizados = await updatedResponse.json();
                console.log("carritosActualizados en socket server", carritosActualizados.allCarts);

                // Emite los carritos actualizados  al cliente
                    if (carritosActualizados.length === 0) {
                        socket.emit("carritosActualizados", []);
                        console.log('carritos actualizados en socketserver', carritosIniciales);
                
                    } else {
                        socket.emit("carritosActualizados", carritosActualizados.allCarts);
                        console.log('carritos actualizados en socketserver', carritosActualizados);                
                    } }
        } catch (error) {
            console.error("Error al obtener carritos iniciales:", error);
        }
    });

    socket.on("disconnect", () =>{
        console.log(`cliente desconectado ${socket.id}`)
    })
});
};



