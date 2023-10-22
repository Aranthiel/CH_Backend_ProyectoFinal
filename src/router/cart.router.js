import {Router} from "express";
import { 
    getCartByIdC,
    addCartC,
    addProductToCartC,
    getCartsC,
    updateCartC,
    updateProductFromCartC,
    deleteCartC,
    deleteAllProductsFromCartC,
    delteProductFromCartC
} from '../controller/cart.controller.js'

//DELETE api/carts/:cid/products/:pid para eliminar del carrito el producto seleccionado
//PUT api/cart/:cid actualiza carrito cn arreglo de productos especificado arriba

//PUT api/carts/:cid/Products/:pid solo permitre actualizar la cantidad de ese producto por la pasada desde query.body

//DELETE api/carts/:cid elimina los productos del carrito

const cartsRouter = Router();


//GET 
//obtener TODOS LOS carritos
cartsRouter.get('/', getCartsC);

//obtener TODOS LOS PRODUCTOS de un carrito
cartsRouter.get('/:cid', getCartByIdC);

//POST
// CREAR un carrito
cartsRouter.post('/', addCartC);

//AGREGAR PRODUCTO a un carrito existente
cartsRouter.post('/:cid/product/:pid', addProductToCartC);

//PUT
//actualiza carrito cn arreglo de productos especificado arriba
cartsRouter.put('/:cid', updateCartC);

//solo permitre actualizar la cantidad de ese producto por la pasada desde query.body
cartsRouter.put('/:cid/product/:pid', updateProductFromCartC);

//Endpoint DELETE para ELIMINAR todos los productos de un carrito ¿pero no el carrito? ///  falta desarrollar
cartsRouter.delete('/delete/:cid', deleteCartC); 

//Endpoint DELETE para ELIMINAR todos los productos de un carrito ¿pero no el carrito? ///  falta desarrollar
cartsRouter.delete('/:cid', deleteAllProductsFromCartC); 

//Endpoint DELETE para ELIMINAR PRODUCTO a un carrito existente ///  falta desarrollar
cartsRouter.delete('/:cid/product/:pid', delteProductFromCartC);

export default cartsRouter