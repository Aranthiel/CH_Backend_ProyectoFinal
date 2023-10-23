export function initializeRealTimeProducts(socket, buildApiUrl) {
    // Obtener productos iniciales en tiempo real
    socket.on("getRealTimeProducts", async () => {
        try {
            const apiUrl = buildApiUrl('products?limit=100');
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error al obtener productos en tiempo real: ${response.statusText}`);
            }

            const productosIniciales = await response.json();

            // Emite los productos iniciales al cliente
            socket.emit("productosInicialesRT", productosIniciales.products);
            console.log('Productos iniciales RT emitidos desde socketserver');
        } catch (error) {
            console.error("Error al obtener productos iniciales en tiempo real:", error);
        }
    });

    // Agregar un nuevo producto en tiempo real
    socket.on('addRealTimeProduct', async (nProduct) => {
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
                    console.log('productsUpdated emitidos desde socketserver');
                }
            } else {
                console.log('No se pudo agregar el producto en tiempo real');
            }
        } catch (error) {
            console.error('Error al agregar el producto en tiempo real:', error);
        }
    });

    // Eliminar productos en tiempo real
    socket.on('deleteRealTimeProducts', async (selectedProductIds) => {
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
                    console.log(`Producto con ID ${productId} eliminado con éxito en tiempo real.`);
                } else {
                    productosNoEliminados.push(productId);
                    console.error(`Error al eliminar el producto con ID ${productId} en tiempo real: ${deleteResponse.statusText}`);
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
                console.log('Todas las eliminaciones se completaron con éxito en tiempo real');
            } else {
                console.error('Error al obtener productos actualizados en tiempo real:', getResponse.statusText);
            }
        } catch (error) {
            console.error('Error durante la eliminación en tiempo real:', error);
        }
    });
}
