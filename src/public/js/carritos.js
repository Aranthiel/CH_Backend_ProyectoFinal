console.log("carritos.js It's alive!");

const socketClient = io();
const carritosContainer = document.getElementById("carritos");
carritosContainer.innerHTML = "carritos.js funciona";

// Renderizar los carritos en el DOM
function renderCarts(carritos) {
    console.log('carritos.js: se esta ejecutando renderCarts')
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
            const productoElement = document.createElement('div');
            productoElement.classList.add('producto');

            // Agregar el ID del producto (_id) como el ID del elemento
            productoElement.id = `producto_${producto._id}`;

            // Agregar el nombre del producto
            const nombreProducto = document.createElement('span');
            nombreProducto.textContent = `Nombre: ${producto.nombre}`;
            // Agregar el atributo "data-id" con el valor del _id
            nombreProducto.setAttribute('data-id', producto._id);
            productoElement.appendChild(nombreProducto);

            // Agregar el precio del producto
            const precioProducto = document.createElement('span');
            precioProducto.textContent = `Precio: $${producto.precio}`;
            // Agregar el atributo "data-id" con el valor del _id
            precioProducto.setAttribute('data-id', producto._id);
            productoElement.appendChild(precioProducto);

            // Agregar un campo de entrada de tipo número
            const cantidadInput = document.createElement('input');
            cantidadInput.type = 'number';
            cantidadInput.value = producto.quantity; // Establece el valor inicial
            cantidadInput.setAttribute('data-quantity', producto.quantity); // Almacena la cantidad original
            cantidadInput.addEventListener('input', (event) => {
                // Verifica si la cantidad ha cambiado
                const newQuantity = parseInt(event.target.value);
                const originalQuantity = parseInt(
                    event.target.getAttribute('data-quantity'),
                    10
                );

                // Habilita o deshabilita el botón "Actualizar" según si la cantidad ha cambiado
                if (newQuantity !== originalQuantity) {
                    actualizarBoton.removeAttribute('disabled');
                } else {
                    actualizarBoton.setAttribute('disabled', true);
                }
            });
            productoElement.appendChild(cantidadInput);

            // Agregar un botón "Actualizar"
            const actualizarBoton = document.createElement('button');
            actualizarBoton.textContent = 'Actualizar';
            // Agregar el _id del producto como el valor del botón
            actualizarBoton.value = producto._id;
            actualizarBoton.setAttribute('disabled', true);
            actualizarBoton.addEventListener('click', () => {
                // Obtener el ID del producto y la cantidad actualizada del botón y del campo de entrada
                const productoId = actualizarBoton.value;
                const cantidadActualizada = parseInt(cantidadInput.value);

                // Emitir el evento "actualizarCantidadProductoEnCarrito" con el ID del producto y la cantidad actualizada
                socketClient.emit('actualizarCantidadProductoEnCarrito', {
                    productoId,
                    cantidad: cantidadActualizada
                });
            });
            productoElement.appendChild(actualizarBoton);



            // Agregar un botón "Eliminar"
            const eliminarBoton = document.createElement('button');
            eliminarBoton.textContent = 'Eliminar';
            // Agregar el _id del producto como el valor del botón
            eliminarBoton.value = producto._id;
            eliminarBoton.addEventListener('click', () => {
                // Obtener el ID del producto del botón
                const productoId = actualizarBoton.value;
                
                // Emitir el evento "borrarProductoDeCarrito" con el ID del producto
                socketClient.emit('borrarProductoDeCarrito', productoId);
                
            });
            productoElement.appendChild(eliminarBoton);

            // Agregar el precio total (precio * cantidad)
            const precioTotal = document.createElement('span');
            precioTotal.textContent = `Total: $${
                producto.price * producto.quantity
            }`;
            // Agregar el atributo "data-id" con el valor del _id
            precioTotal.setAttribute('data-id', producto._id);
            productoElement.appendChild(precioTotal);

            // Agrega el elemento del producto al contenedor de productos
            productosContainer.appendChild(productoElement);
        });



        // Agrega el contenedor de productos al carrito
        carritoCard.querySelector(".card-footer").appendChild(productosContainer);

        // Agrega la card de carrito al contenedor principal
        carritosContainer.appendChild(carritoCard);
    });
}

// Escuchar el evento para recibir los carritos iniciales
socketClient.on("carritosIniciales", (carritosIniciales) => {
    console.log('evento carritosIniciales recibido en carritos.js');
    console.log('carritosIniciales recibido en carritos.js', carritosIniciales);
    renderCarts(carritosIniciales);
});

socketClient.on("carritosActualizados", (carritosActualizados) => {
    console.log('evento carritosActualizados recibido en carritos.js');
    //console.log('carritosActualizados recibido en carritos.js', carritosActualizados);
    // Actualiza la interfaz de usuario con los carritos actualizados
    renderCarts(carritosActualizados);
});