import fs from 'fs';
import { writeDataToFile } from './utilsManagers.js';

export class CartManager{
    
    constructor(path){
        this.path=path;        
    };

    async getCarts(){
        try {
            if (fs.existsSync(this.path)){
                const info = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(info);
            } else {
                return [];
            };            
        } catch (error) {
            return error;            
        };

    }

    //endpopint GET CARRITO POR SU ID deberá listar los productos que pertenezcan al carrito 
    async getCartById(cartId){
        try {
            console.log(`Tipo de cartId en product Manager: ${typeof cartId}, Valor de cartId: ${cartId}`);

            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cartId);

            if(!cart){
                console.log(`ERROR:NOT FOUND. El carrito ${cartId} NO EXISTE, por favor ingrese un carrito válido`);
                return null; // Devuelve null en lugar de una cadena de error
            } else {
                return cart; // devuelve el carrito
            };
        } catch (error) {
            return error
        }
    };

    //Endpoint POST para CREAR UN NUEVO CARRITO con la siguiente estructura: 
    //id: Number 
    //products:Array de productos
    async addCart(productos){
        try {
            const carts = await this.getCarts();
            let cartId;

            // Asignar un ID autoincremental al producto
            if (!carts.length) {
                // Si el arreglo de productos está vacío, asigna el ID 1
                cartId= 1;
            } else {
                cartId = carts[carts.length-1].id+1;
            }

            // Crea un nuevo carrito con los productos proporcionados
            const newCart = {
            id: cartId,
            products: productos || [], // Usa los productos proporcionados o un arreglo vacío si no se especifican
        };

            carts.push(newCart);
            await writeDataToFile(this.path, carts);
            return newCart;
        } catch (error) {
            return error
        }
    };


    // la ruta POST /:cid/product/:pid deberá agregar el producto al arreglo products del carrito seleccionado bajo el siguiente formato:
    async updateCart(cartId, productId, quantity){
        //products SOLO DEBE CONTENER EL ID DEL PRODUCTO
        try {
            const carts = await this.getCarts();
            console.log("carts:", carts);
            let cart = await this.getCartById(cartId)
            console.log("Cart:", cart);

             // Verifica si el carrito existe
            console.log("!Cart:", !cart);
            if (!cart) {
            console.log(`ERROR:NOT FOUND. El carrito ${cartId} NO EXISTE, por favor ingrese un carrito válido`);
            return null; // Devuelve null en lugar de una cadena de error
            }
            
            //busca el indice del carrito en el  archivo de carritos
            const cartIndex = carts.findIndex(cart => cart.id === cartId); 
            console.log("cartIndex:", cartIndex);
            
            //busca el producto en el carrito
            console.log("cart.products:", cart.products);
            const existingProduct = cart.products.find(product => product.id === productId);
            console.log("existingProduct:", existingProduct); 

            
            //burcar el indice del producto en el carrito
            console.log(`Tipo de productId en product Manager: ${typeof productId}, Valor de productId: ${productId}`);

            const productIndex = cart.products.findIndex(product => product.id=== productId)
            console.log("productIndex:", productIndex);

            //verifica si el producto a agregar ya esta en el carrito            
            if(productIndex !== -1){
                 // Si el producto ya existe en el carrito, actualizar su cantidad
                console.log("cart.products[productIndex]:", cart.products[productIndex]);
                cart.products[productIndex].quantity += quantity;
                console.log("Cart:", cart);
            } else {
                //si el producto no existe agrega el producto y la cantidad
                cart.products.push({id:productId , quantity})  
                console.log("Cart:", cart);             
            }

            // Actualizar el carrito en la lista de carritos
            const newUpdateCart = carts.map((c, index) => {
                return index === cartIndex ? cart : c;
            });

            // Escribir los datos actualizados en el archivo
            await writeDataToFile(this.path, newUpdateCart);
        
            return cart;

        } catch (error) {
            return error
        }
    };    
}

export const cartManager= new CartManager('carritos.json');
