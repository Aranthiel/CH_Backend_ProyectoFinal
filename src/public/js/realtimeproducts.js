
console.log("It's alive!");

const socketClient = io();
const form = document.getElementById("productForm");
const divShowProducts = document.getElementById("showProducts");

const title = document.createElement("h2");
title.textContent = "Productos";

const deleteButton = document.createElement("button");
deleteButton.textContent = "Eliminar Productos";

// Inicializar productos como un arreglo vacío
let productos = [];
//console.log('productos', productos);

form.addEventListener("submit", (event) => {
    coonsole.log('click en boton enviar de realtimeproducts.js')
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
    console.log('realtimeproducts.js ejecutando renderProducts')
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

// Escuchar el evento para recibir los productos iniciales
socketClient.on("productosInicialesRT", (productosIniciales) => {
    console.log('Evento productosInicialesRT recibido en realtimeproducts.js')
    //console.log('productosIniciales en realtimeproducts.js', productosIniciales);
    productos = productosIniciales;
    renderProducts(productos);
});

// Escuchar el evento para recibir los productos actualizados
socketClient.on("productsUpdated", (productosActualizados) => {
    console.log('Evento productosActualizados recibido en realtimeproducts.js')
    productos = productosActualizados;
    //console.log("productosActualizados en realtimeproducts.js", productosActualizados);
    renderProducts(productos);
});
    
// Agregar lógica para eliminar productos
deleteButton.addEventListener("click", () => {
    console.log('click en boton borrar en realtimeproducts.js')
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
    console.log('evento productsDeleted recibido en realtimeproducts.js');
    // Manejar productos eliminados con éxito
    console.log('Productos eliminados con éxito:', deletedProductIds);
    // Puedes realizar acciones en la interfaz de usuario si es necesario
});

socketClient.on('productsNotDeleted', (notDeletedProductIds) => {
    console.log('evento productsNotDeleted recibido en realtimeproducts.js');
    // Manejar productos que no se pudieron eliminar
    console.error('Productos que no se pudieron eliminar:', notDeletedProductIds);
    // Puedes mostrar mensajes de error o realizar acciones adicionales si es necesario
});

//  "Crear Carrito"
createCartButton.addEventListener("click", () => {
    console.log("Click en createCartButton en realtimeproducts");

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





