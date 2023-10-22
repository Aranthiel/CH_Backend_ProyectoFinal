
console.log("products.js: It's alive!");

const socketClient = io();
const divShowProducts = document.getElementById("showProducts");

// Inicializar productos como un arreglo vacío
let productos = [];
console.log('products.js: Productos en productView', productos);

function updatePagination(info) {
    const prevPageButton = document.getElementById("prevPage");
    const nextPageButton = document.getElementById("nextPage");
    const currentPageSpan = document.getElementById("currentPage");

    // Actualiza la página actual
    currentPageSpan.textContent = `Página ${info.page}`;
    currentPageSpan.setAttribute("data-value", info.page);

    if (info.hasPrevPage) {
        console.log('info.prevLink', info.prevLink)
        prevPageButton.value = info.prevLink;
        prevPageButton.disabled = false; // Habilita el botón
    } else {
        prevPageButton.value = "";
        prevPageButton.disabled = true; // Deshabilita el botón
    }

    if (info.hasNextPage) {
        console.log('info.nextLink', info.nextLink)
        nextPageButton.value = info.nextLink;
        nextPageButton.disabled = false; // Habilita el botón
    } else {
        nextPageButton.value = "";
        nextPageButton.disabled = true; // Deshabilita el botón
    }
}

// Función para pasar a la página siguiente o anterior
function pasarDePagina(offset) {   

    // Obtener Nro de pagina actual
    const span = document.getElementById("currentPage");
    const pagAct = span.dataset.value;
    const aPagina = +pagAct + offset;
    console.log(`products.js: Pasando desde la pag ${pagAct} a la página ${aPagina}`);
    
    // Verifica que aPagina sea mayor que 0 antes de continuar
    if (aPagina > 0) {
        // Obtener el elemento del botón que se hizo clic
        const btn = document.activeElement;
        const nuevaUrl = btn.getAttribute("value");
        console.log=('nuevaUrl',nuevaUrl)

        // Emitir el evento "actualizarProductos" con la nueva URL que incluye "/api"
        socketClient.emit("actualizarProductos", nuevaUrl);

        // Navegar a la nueva URL
        //window.location.href = `/products?page=${aPagina}`;
    } else {
        console.log("La página resultante no es válida.");
    }
}

// Función para renderizar las tarjetas de productos
function renderProducts(productos) {
    console.log('products.js: Ejecutando renderProducts');
    const productCardsContainer = document.getElementById("productCards");
    productCardsContainer.innerHTML = ""; // Limpiamos el contenedor

    productos.forEach((producto) => {
        // Crear un div para la tarjeta del producto
        const productCard = document.createElement("div");
        productCard.classList.add("card", "col-md-4", "mb-4");

        // Agregar contenido a la tarjeta
        productCard.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${producto.title}</h5>
                <p class="card-text">Categoría: ${producto.category}</p>
                <p class="card-text">Precio: $${producto.price}</p>
                <label for="quantity">Cantidad:</label>
                <select id="quantity_${producto._id}">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
                <button id="btnAddToCart_${producto._id}" class="btn btn-primary">Agregar al carrito</button>
            </div>
        `;

        // Agregar la tarjeta al contenedor
        productCardsContainer.appendChild(productCard);

        // Agregar un manejador de eventos para redirigir al hacer clic en la tarjeta
        productCard.addEventListener("click", () => {
            window.location.href = `/api/products/${producto._id}`;
        });

        // Agregar un manejador de eventos al botón "Agregar al carrito"
        const btnAddToCart = document.getElementById(`btnAddToCart_${producto._id}`);
        btnAddToCart.addEventListener("click", () => {
            const productId = producto._id;
            const quantitySelector = document.getElementById(`quantity_${productId}`);
            const selectedQuantity = quantitySelector.value;

            // Emitir el evento "agregarAlCarrito" con el ID del producto y la cantidad seleccionada
            socketClient.emit("agregarAlCarrito", { productId, quantity: selectedQuantity });
        });

    });
}

// Al cargar la página por primera vez
socketClient.on("productosIniciales", (productosIniciales, info) => {
    console.log('products.js: Recibido evento "productosIniciales"');
    productos = productosIniciales;
    renderProducts(productos);
    console.log('info', info)
    updatePagination(info);
});

// Al recibir productos actualizados
socketClient.on("productosActualizados", (productosActualizados, info) => {
    console.log('products.js: Recibido evento productosActualizados');
    productos = productosActualizados;
    renderProducts(productos);
    updatePagination(info);
});

// Escucha el evento para recibir la información de paginación y actualiza la paginación
socketClient.on("paginationInfo", (info) => {
    console.log('products.js: Recibido evento "paginationInfo"');
    updatePagination(info);
});

// Función para actualizar la información de productos
function actualizarProductos(url) {
    console.log('products.js: Ejecutando actualizarProductos');
    // Emitir el evento "actualizarProductos" con la URL de destino
    socketClient.emit("actualizarProductos", url);
}

// Agregar manejadores de eventos para los enlaces de página siguiente y página anterior
nextPageLink.addEventListener("click", (event) => {
    console.log('products.js: Click en enlace de página siguiente');
    event.preventDefault();
    const nextPageUrl = event.target.href;
    actualizarProductos(nextPageUrl);
});

prevPageLink.addEventListener("click", (event) => {
    console.log('products.js: Click en enlace de página anterior');
    event.preventDefault();
    const prevPageUrl = event.target.href;
    actualizarProductos(prevPageUrl);
});


//  "Crear Carrito"
createCartButton.addEventListener("click", () => {
    console.log('products.js: Click en el botón "Crear Carrito"');

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
            console.log('products.js: Enviando evento "crearCarrito" con los siguientes datos:', cartData);
            socketClient.emit("crearCarrito", cartData);

            // Desmarcar las checkbox
            selectedCheckboxes.forEach((checkbox) => {
                checkbox.checked = false;
            });
        }
    });
});

// Agregar un manejador de eventos al botón "Agregar al carrito"
btnAddToCart.addEventListener("click", () => {
    const productId = producto._id;
    const quantitySelector = document.getElementById(`quantity_${productId}`);
    const selectedQuantity = quantitySelector.value;

    // Emitir el evento "agregarAlCarrito" con el ID del producto y la cantidad seleccionada
    socketClient.emit("agregarAlCarrito", { productId, quantity: selectedQuantity });
});


// Agregar lógica para eliminar productos
/* deleteButton.addEventListener("click", () => {
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
 */




