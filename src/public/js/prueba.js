console.log("It's alive!");

const socketClient = io();
const divShowProducts = document.getElementById("showProducts");

const deleteButton = document.createElement("button");
deleteButton.textContent = "Eliminar Productos";
divShowProducts.appendChild(deleteButton);

const createCartButton = document.createElement("button");
createCartButton.textContent = "Crear Carrito";
divShowProducts.appendChild(createCartButton);

// Inicializar productos como un arreglo vacío
let productos = [];

// Función para renderizar las tarjetas de productos
function renderProducts(productos) {
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

// Escuchar el evento para recibir los productos iniciales
socketClient.on("productosIniciales", (productosIniciales) => {
    productos = productosIniciales;
    renderProducts(productos);
});

// Resto del código (manejo de eventos, eliminar productos, crear carrito, etc.)
