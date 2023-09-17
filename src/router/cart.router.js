import {Router} from "express";
import { cartManager } from "../managers/cartManager";
const router = Router();


//endpopint GET CARRITO POR SU ID deberá listar los productos que pertenezcan al carrito 
router.get('/:cid', async (req, res)=>{
    //usa el metodo getCartById(cartId) de cartManager.js 
}); 

//Endpoint POST para CREAR UN NUEVO CARRITO con la siguiente estructura: 
//id: Number 
//products:Array de productos

router.post('/', async (req, res)=>{
    //usa el metodo addCart de cartManager.js    
}); 


// la ruta POST /:cid/product/:pid deberá agregar el producto al arreglo products del carrito seleccionado bajo el siguiente formato:
//products SOLO DEBE CONTEBNER EL ID DEL PRODUCTO
// quantity debe contener el numero de ejemplaresde dichjp producto. el producto de momento se agregará de uno en uno
//además si un producto ya existente intenta agregarse al carrito, se debe incrementar el campo queantity de dicho producto
router.post('/:cid/product/:pid', async (req, res)=>{
    //usa el metodo updateCart de cartManager.js
}); 


export default router