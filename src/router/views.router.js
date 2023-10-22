import {Router} from "express";
import { 
    getHomeProductsC,
    getRealTimeProductsC,
    productCardRender,
    getCartsC,
    getCartByIdC
} from '../controller/views.controller.js'


// corregir usando views,router del proyecto que me paso cristian y pasando la logica a views.controller.js

const viewsRouter = Router();

//endpopint productos estaticos
viewsRouter.get('/', getHomeProductsC); 

//endpopint productos RT
viewsRouter.get('/realtimeproducts',getRealTimeProductsC); 

//endpopint productos RT
viewsRouter.get(/^\/products/, productCardRender); 
//endpoint CARRITOS
viewsRouter.get('/carts', getCartsC); 

//endpoint para un carrito especifico
viewsRouter.get('/carts/:cid ', getCartByIdC); 



export default viewsRouter


