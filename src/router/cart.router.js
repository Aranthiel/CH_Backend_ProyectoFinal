import {Router} from "express";
import { 
    getCartByIdC,
    addCartC,
    addProductToCartC,
    getCartsC,
    deleteCartC,
    delteProductFromCartC
} from '../controller/cart.controller.js'

//este archivo no está en uso 

const cartsRouter = Router();

//endpopint GET para obtener TODOS LOS carritos
cartsRouter.get('/', getCartsC)

//endpopint GET para obtener TODOS LOS PRODUCTOS de un carrito
cartsRouter.get('/:cid', getCartByIdC)

//endpopint POST para CREAR un carrito
cartsRouter.post('/', addCartC)

//Endpoint POST para AGREGAR PRODUCTO a un carrito existente
cartsRouter.post('/:cid/product/:pid', addProductToCartC)

//Endpoint DELETE para ELIMINAR un carrito existente ///  falta desarrollar
cartsRouter.delete('/:cid', deleteCartC)

//Endpoint DELETE para ELIMINAR PRODUCTO a un carrito existente ///  falta desarrollar
cartsRouter.delete('/:cid/product/:pid', delteProductFromCartC)

export default cartsRouter