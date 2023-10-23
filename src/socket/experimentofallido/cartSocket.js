// cartSocket.js

export function initializeCart(socket, buildApiUrl) {
	// Obtiene los carritos iniciales y los emite al cliente
	async function getInitialCarts() {
		try {
			const apiUrl = buildApiUrl('carts');
			const response = await fetch(apiUrl);

			if (!response.ok) {
				throw new Error(`Error al obtener carritos: ${response.statusText}`);
			}

			const carritosIniciales = await response.json();

			if (carritosIniciales.length === 0) {
				socket.emit('carritosIniciales', []);
			} else {
				socket.emit('carritosIniciales', carritosIniciales.allCartsCC);
			}
		} catch (error) {
			console.error('Error al obtener carritos iniciales:', error);
		}
	}

	// Agregar un listener para el evento "crearCarrito"
	socket.on('crearCarrito', async (cartData) => {
		try {
			// Transforma el array en un objeto con la propiedad "products"
			const requestBody = { products: cartData };

			const apiUrl = buildApiUrl('carts');
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody),
			});

			if (response.ok) {
				// Después de agregar con éxito, obtén la lista actualizada de carritos
				const updatedResponse = await fetch(apiUrl);

				if (!updatedResponse.ok) {
					throw new Error(`Error al obtener carritos: ${response.statusText}`);
				}

				const carritosActualizados = await updatedResponse.json();

				if (carritosActualizados.length === 0) {
					socket.emit('carritosActualizados', []);
				} else {
					socket.emit('carritosActualizados', carritosActualizados.allCarts);
				}
			}
		} catch (error) {
			console.error('Error al obtener carritos iniciales:', error);
		}
	});

	// Llama a la función para obtener los carritos iniciales cuando se conecta un cliente
	socket.on('connection', () => {
		getInitialCarts();
	});
}