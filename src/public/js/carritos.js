console.log("It's alive!");

const socketClient = io();

const divCarrito = document.getElementById("carritos");

const createCartButton = document.createElement("button");
createCartButton.textContent = "Crear Carrito";

const deleteCartButton  = document.createElement("button");
deleteCartButton.textContent = "Eliminar Caritos";

// Renderizar los carritos en el DOM
function renderCarts(carritos) {
    console.log('carritos.js  funcion renderCarts')
    // Limpiar el contenido anterior del div "divCarrito"
    divCarrito.innerHTML = "";

    // Itera a través de los carritos
    carritos.forEach((carrito) => {
        // Crear un elemento de lista (li) para cada carrito
        const li = document.createElement("li");
        li.id = `cart_${carrito._id}`;

        // Crear una casilla de verificación (checkbox)
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox_${carrito._id}`;
        li.appendChild(checkbox);

        // Crear un elemento de span para mostrar el ID del carrito
        const cartInfo = document.createElement("span");
        cartInfo.textContent = `Carrito: ${carrito._id} - Productos: `;
        li.appendChild(cartInfo);

        // Crear una lista desordenada (ul) para los productos del carrito
        const ul = document.createElement("ul");

        // Itera a través de los productos del carrito
        carrito.products.forEach((producto) => {
            // Crear elementos de lista (li) para cada producto
            const productLi = document.createElement("li");
            productLi.textContent = `Producto ${producto.productoId} - Cantidad: ${producto.quantity}`;
            ul.appendChild(productLi);
        });

        // Agregar la lista de productos al elemento li
        li.appendChild(ul);

        // Agregar el elemento li al div "divCarrito"
        divCarrito.appendChild(li);
    });

    // Agregar el botón "Eliminar Productos" al final
    divCarrito.appendChild(deleteCartButton);
}

// Escuchar el evento para recibir los carritos iniciales
socketClient.on("carritosIniciales", (carritosIniciales) => {
    onsole.log(' evento carritosIniciales recibido en carritos.js');
    //console.log('carritosIniciales recibido en carritos.js', carritosIniciales);
    renderCarts(carritosIniciales);
});

socketClient.on("carritosActualizados", (carritosActualizados) => {
    console.log('evento carritosActualizados recibido en carritos.js');
    //console.log('carritosActualizados recibido en carritos.js', carritosActualizados);
    // Actualiza la interfaz de usuario con los carritos actualizados
    renderCarts(carritosActualizados);
});