// productsSocket.js

export function initializeProducts(socket, buildApiUrl) {
    // Obtiene los productos iniciales y los emite al cliente
    async function getInitialProducts() {
        try {
            const apiUrl = buildApiUrl('products');
            console.log('productosIniciales apiUrl', apiUrl);
            const response = await fetch(apiUrl);
    
            if (!response.ok) {
            throw new Error(`Error al obtener productos: ${response.statusText}`);
            }
    
            const productosIniciales = await response.json();
    
            // Emite los productos iniciales al cliente
            socket.emit("productosIniciales", productosIniciales.products, productosIniciales.info);
            console.log('Productos iniciales emitidos desde productsSocket');
        } catch (error) {
            console.error("Error al obtener productos iniciales:", error);
        }
    }

    // Agrega un listener para el evento "actualizarProductos"
    socket.on("actualizarProductos", async (url) => {
        console.log(`Evento "actualizarProductos" recibido en productsSocket.js con la URL: ${url}`);

        try {
            // Realiza una solicitud GET a la URL proporcionada

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Error al obtener productos: ${response.statusText}`);
            }

            const productosActualizados = await response.json();

            // Emite los productos actualizados al cliente
            socket.emit("productosActualizados", productosActualizados.products, productosActualizados.info);
            console.log('Productos actualizados emitidos desde productsSocket');
        } catch (error) {
            console.error("Error al obtener productos actualizados:", error);
        }
    }
);

    // Llama a la función para obtener los productos iniciales cuando se conecta un cliente
    socket.on("connection", () => {
        getInitialProducts();
    });
}