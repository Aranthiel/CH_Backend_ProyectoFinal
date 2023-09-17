import fs from 'fs';
import { writeDataToFile } from './utils.managers';

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
    async addCart(){
        try {
            const carts = await this.getCarts();
            const cart={};

            //¿deberìa verificar que cart sea un array? 

            // Asignar un ID autoincremental al producto
            if (!carts.length) {
                // Si el arreglo de productos está vacío, asigna el ID 1
                cart.id = 1;
            } else {
                cart.id = carts[carts.length-1].id+1;
            }

            carts.push({ id: cart.id, products: [] });
            await writeDataToFile(this.path, carts);
        } catch (error) {
            return error
        }
    };


    // la ruta POST /:cid/product/:pid deberá agregar el producto al arreglo products del carrito seleccionado bajo el siguiente formato:
    async updateCart(cartId, productId, quantity = 1){
        //products SOLO DEBE CONTENER EL ID DEL PRODUCTO
        //quantity debe contener el numero de ejemplares de dicho producto. El producto de momento se agregará de uno en uno (quantity = 1)
        try {
            const cart = await this.getCartById(cartId);

           // Si el carrito no existe
            if (!cart) {
                // Crea el carrito utilizando addCart 
                cart = await this.addCart({});
            }

            //verifica si el producto a agregar ya esta en el carrito
            const pExist = cart.products.find(product => product.id === productId);
            if(pExist){
                //si un producto ya existente intenta agregarse al carrito, se debe incrementar el campo queantity de dicho producto
                pExist.quantity += quantity;
            } else {
                //agrega el producto al arreglo products
            }
        } catch (error) {
            return error
        }
    };    
}

export const cartManager= new CartManager('../Carts.json');
