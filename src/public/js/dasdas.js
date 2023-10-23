console.log("It's alive!");

const socketClient = io();
const form = document.getElementById("productForm");
const divShowProducts = document.getElementById("showProducts");

const title = document.createElement("h2");
title.textContent = "Productos";

const deleteButton = document.createElement("button");
deleteButton.textContent = "Eliminar Productos";

const createCartButton = document.createElement("button");
createCartButton.textContent = "Crear Carrito";

const divCarrito = document.getElementById("carritos");

const deleteCartButton  = document.createElement("button");
deleteCartButton.textContent = "Eliminar Caritos";

// Inicializar productos como un arreglo vacío
let productos = [];
console.log('productos', productos);

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Evitar que el formulario se envíe de forma tradicional
    console.log("form submit")

    // Obtener los valores del formulario
    const title = document.getElementById("title").value;
    const code = document.getElementById("code").value;
    const price = parseFloat(document.getElementById("price").value);
    const status = document.getElementById("status").checked;
    const stock = parseInt(document.getElementById("stock").value);
    const category = document.getElementById("category").value;

    // Crear un objeto con los datos del producto
    const nProduct = {
        title,
        code,
        price,
        status,
        stock,
        category,
    };
   

    // Enviar el producto al servidor a través de Socket.io
    console.log('Enviando evento "addProduct" con los siguientes datos:', nProduct);
    socketClient.emit("addProduct", nProduct);

    // Limpiar el formulario
    form.reset();
    document.getElementById("title").focus();
});


//renderizar los productos en el DOM
function renderProducts(productos) {
    const ul = document.createElement("ul");
    
    productos.forEach((producto) => {
        const li = document.createElement("li");
        li.id = `product_${producto._id}`;
        
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox_${producto._id}`;
        li.appendChild(checkbox);
    
        const productInfo = document.createElement("span");
        productInfo.textContent = `Título: ${producto.title}, Precio: ${producto.price}, ID: ${producto._id}`;
        li.appendChild(productInfo);
    
        ul.appendChild(li);
    });

    divShowProducts.innerHTML = "";
    divShowProducts.appendChild(title);
    divShowProducts.appendChild(ul);
    divShowProducts.appendChild(deleteButton);
    divShowProducts.appendChild(createCartButton);
}


// Renderizar los carritos en el DOM
function renderCarts(carritos) {
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
    divCarrito.appendChild(deleteButton);
}




// Escuchar el evento para recibir los productos iniciales
socketClient.on("productosIniciales", (productosIniciales) => {
    console.log('productosIniciales en realtimeproducts.js', productosIniciales);
    productos = productosIniciales;
    renderProducts(productos);
});

// Escuchar el evento para recibir los productos actualizados
socketClient.on("productsUpdated", (productosActualizados) => {
    productos = productosActualizados;
    console.log("productosActualizados en realtimeproducts.js", productosActualizados);
    renderProducts(productos);
});
    
// Agregar lógica para eliminar productos
deleteButton.addEventListener("click", () => {
    const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedProductIds = Array.from(selectedCheckboxes).map((checkbox) => {
        return checkbox.id.replace("checkbox_", "");
    });

    const confirmation = Swal.fire({
        title: '¿Quieres borrar esto?',
        text: `Ha seleccionado ${selectedProductIds.length} productos para eliminar`, 
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar'
    });

    confirmation.then((result) => {
        if (result.isConfirmed) {
            // Emitir el evento "borrar" con los IDs de los productos seleccionados
            console.log('Enviando evento "borrar" con los siguientes datos:', selectedProductIds);
            socketClient.emit("borrar", selectedProductIds);

            // Desmarcar las checkbox
            selectedCheckboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });
        }
    });
});

socketClient.on('productsDeleted', (deletedProductIds) => {
    // Manejar productos eliminados con éxito
    console.log('Productos eliminados con éxito:', deletedProductIds);
    // Puedes realizar acciones en la interfaz de usuario si es necesario
});

socketClient.on('productsNotDeleted', (notDeletedProductIds) => {
    // Manejar productos que no se pudieron eliminar
    console.error('Productos que no se pudieron eliminar:', notDeletedProductIds);
    // Puedes mostrar mensajes de error o realizar acciones adicionales si es necesario
});


// Escuchar el evento para recibir los productos iniciales
socketClient.on("carritosIniciales", (carritosIniciales) => {
    console.log('carritosIniciales en realtimeproducts.js', carritosIniciales);
    productos = carritosIniciales;
    renderCarts(carritos);
});

// Cuando se haga clic en "Crear Carrito", realiza las acciones que deseas
createCartButton.addEventListener("click", () => {
    console.log("createCartButton en realtimeproducts");

    const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedProductIds = Array.from(selectedCheckboxes).map((checkbox) => {
        return checkbox.id.replace("checkbox_", "");
    });

    // Formatear los datos en la estructura esperada por el servidor
    const cartData = selectedProductIds.map(productId => ({
        productoId: productId,
        quantity: Math.floor(Math.random() * 50) + 1, // Número aleatorio entre 1 y 50
    }));

    // Muestra la confirmación
    const confirmation = Swal.fire({
        title: '¿Quieres crear un carrito?',
        text: `Ha seleccionado ${selectedProductIds.length} productos para agregar al carrito`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Crear Carrito',
    });

    confirmation.then((result) => {
        if (result.isConfirmed) {
            // Emitir el evento "crearCarrito" con los datos formateados
            console.log('RTP Enviando evento "crearCarrito" con los siguientes datos:', cartData);
            socketClient.emit("crearCarrito", cartData);

            // Desmarcar las checkbox
            selectedCheckboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });
        }
    });
});




// Escuchar el evento para recibir los carritos actualizados
socketClient.on("cartsUpdated", (carritosActualizados) => {
    productos = carritosActualizados;
    console.log("carritosActualizados en realtimeproducts.js", carritosActualizados);
    renderCarts(carritos);
});
