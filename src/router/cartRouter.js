import {Router} from "express";
import { cartManager } from '../managers/CartManager.js';
const router = Router();


//endpopint GET CARRITO POR SU ID deberá listar los productos que pertenezcan al carrito 
router.get('/:cid', async (req, res)=>{
    //usa el metodo getCartById(cartId) de cartManager.js 
    const {cid}=req.params;
    console.log(`Tipo de productId en routes: ${typeof cid}, Valor de productId: ${cid}`);
    
    try {
        const cartById= await cartManager.getCartById(+cid)
        if(cartById){
            res.status(200).json({message: 'Carrito encontrado:', cartById})
        }  else {
            res.status(404).json({message: `No se encontro el carrito con el id ${cartId}`})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

//Endpoint POST para CREAR UN NUEVO CARRITO con la siguiente estructura: 
//id: Number 
//products:Array de productos

router.post('/', async (req, res)=>{
    //usa el metodo addCart de cartManager.js
    try {
        const nuevoCarrito= await cartManager.addCart();
        res.status(201).json({message: `Carrito creado con exito`});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 


// la ruta POST /:cid/product/:pid deberá agregar el producto al arreglo products del carrito seleccionado bajo el siguiente formato:
//products SOLO DEBE CONTEBNER EL ID DEL PRODUCTO
// quantity debe contener el numero de ejemplaresde dichjp producto. el producto de momento se agregará de uno en uno
//además si un producto ya existente intenta agregarse al carrito, se debe incrementar el campo queantity de dicho producto
router.post('/:cid/product/:pid', async (req, res)=>{
    //usa el metodo updateCart de cartManager.js
    const { cartId, productId } = req.params;
    const { quantity } = req.body; // verifica si se envió cantidad en el body de la request, si no se envió el metodo updateCart le asigna por defecto valor = 1
    
    //quantity debe contener el numero de ejemplares de dicho producto. El producto de momento se agregará de uno en uno (quantity = 1)
    if (typeof quantity !== 'number' || isNaN(quantity)) {
        quantity = 1;
    }

    try {
        const updatedCart = await cartManager.updateCart(cartId, productId, quantity);
        res.status(200).json({ message: 'Producto agregado al carrito con éxito', updatedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}); 


export default router