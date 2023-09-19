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
            console.log(`Tipo de productId en product Manager: ${typeof cartId}, Valor de productId: ${cartId}`);

            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cartId);

            if(!cart){
                console.log(`ERROR:NOT FOUND. El carrito ${cartId} NO EXISTE, por favor ingrese un carrito válido`);
                return null; // Devuelve null en lugar de una cadena de error
            } else {
                return cart.products; // devuelve un array con los productos del carrito, si esta vacio, devuelve un array vacío
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

            carts.push({ id: cartId, products:  productos});
            await writeDataToFile(this.path, carts);
            return {id: cartId, products:  productos};
        } catch (error) {
            return error
        }
    };


    // la ruta POST /:cid/product/:pid deberá agregar el producto al arreglo products del carrito seleccionado bajo el siguiente formato:
    async updateCart(cartId, productId, quantity){
        //products SOLO DEBE CONTENER EL ID DEL PRODUCTO
        try {
            const carts = await this.getCartById(cartId);
            let cart = carts.find(cart => cart.id === cartId);

           // Si el carrito no existe
            if (!cart) {
                console.log(`ERROR:NOT FOUND. El carrito ${cartId} NO EXISTE, por favor ingrese un carrito válido`);
                return null; // Devuelve null en lugar de una cadena de error
            }

            const cartIndex = carts.findIndex(cart => cart.id === cartId);

            //burcar el producto en el carrito por su id
            const productIndex = cart.products.findindex(product => product.id=== productId)

            //verifica si el producto a agregar ya esta en el carrito            
            if(productIndex !== -1){
                 // Si el producto ya existe en el carrito, actualizar su cantidad
                cart.products[productIndex].quantity += quantity;
            } else {
                //si el producto no existe agrega el producto y la cantidad
                cart.products.push({id:productId , quantity})                
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
