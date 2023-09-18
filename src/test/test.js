import { producto1, producto2, producto3, producto4, producto5, producto6, producto7, producto8, producto9, producto10, producto11, producto12, producto13, producto14, producto15 } from './objetosPrueba.js';
import { cartManager } from '../managers/cartManager.js';
import { productsManager } from '../managers/ProductsManager.js';

// Agregar productos al sistema
async function addExampleProducts() {
    const products = [
        producto1,
        producto2,
        producto3,
        producto4,
        producto5,
        producto6,
        producto7,
        producto8,
        producto9,
        producto10,
        producto11,
        producto12,
        producto13,
        producto14,
        producto15,
    ];

    for (const product of products) {
        await productsManager.addProduct(product);
    }

    console.log('Productos de ejemplo agregados con éxito.');
}

// Crear carritos de ejemplo
async function addExampleCarts() {
    for (let i = 1; i <= 3; i++) {
        await cartManager.addCart();
    }

    console.log('Carritos de ejemplo agregados con éxito.');
}

// Función principal de prueba
async function main() {
    // Agregar productos al sistema
    await addExampleProducts();

    // Crear carritos de ejemplo
    await addExampleCarts();

    // Realiza aquí más pruebas de tus métodos
}

main();
