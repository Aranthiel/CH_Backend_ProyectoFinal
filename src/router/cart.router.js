import {Router} from "express";
import { 
    getCartByIdC,
    addCartC,
    addProductToCartC
} from '../controller/cart.controller.js'

//este archivo no está en uso 

const cartsRouter = Router();

//endpopint GET para obtener TODOS LOS PRODUCTOS
cartsRouter.get('/:cid', getCartByIdC)
//endpopint GET para obtener un PRODUCTO POR SU ID
cartsRouter.post('/', addCartC)
//Endpoint POST para APGREGAR PRODUCTO
cartsRouter.post('/:cid/product/:pid', addProductToCartC)

export default cartsRouter