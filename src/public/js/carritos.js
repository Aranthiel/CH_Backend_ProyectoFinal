console.log("carrito.js It's alive!");
console.log("Ejecutando carrito.js");

const socketClient = io();
const carritosContainer = document.getElementById("carritos");
carritosContainer.innerHTML = "carrito.js funciona";

// Renderizar los carritos en el DOM
function renderCarts(carritos) {
    console.log('carrito.js: se está ejecutando renderCarts');
    // Obtén el contenedor de carritos
    const carritosContainer = document.getElementById("carritos");

    // Limpia el contenedor antes de renderizar los carritos
    carritosContainer.innerHTML = "";

    // Itera a través de los carritos y crea una card para cada uno
    carritos.forEach((carrito) => {
        // Crea una card para el carrito
        const carritoCard = document.createElement("div");
        carritoCard.classList.add("card");

        // Agrega el ID y el total del carrito
        carritoCard.innerHTML = `
            <div class="card-header">
                Carrito ID: ${carrito._id}
            </div>
            <div class="card-body">
                Total: $${carrito.total}
            </div>
            <div class="card-footer">
                <!-- Botones y detalles del carrito aquí -->
            </div>
        `;

        // Crea un contenedor para los productos dentro de este carrito
        const productosContainer = document.createElement("div");
        productosContainer.classList.add("productos-container");

        // Itera a través de los productos en el carrito y crea elementos para cada uno
        carrito.productos.forEach((producto) => {
            // ... (resto del código)
        });

        // Agrega el elemento del producto al contenedor de productos
        productosContainer.appendChild(productoElement);
    });

    // Agrega la card de carrito al contenedor principal
    carritosContainer.appendChild(carritoCard);
}

// Emitir el evento "vistaActiva" cuando el carrito está activo
socketClient.emit("vistaActiva", "cart");
console.log('Evento "vistaActiva" enviado desde carrito.js');

// Escuchar el evento para recibir los carritos iniciales
socketClient.on("carritosIniciales", (carritosIniciales) => {
    console.log('Evento "carritosIniciales" recibido en carrito.js');
    renderCarts(carritosIniciales);
});

socketClient.on("carritosActualizados", (carritosActualizados) => {
    console.log('Evento "carritosActualizados" recibido en carrito.js');
    // Actualiza la interfaz de usuario con los carritos actualizados
    renderCarts(carritosActualizados);
});
