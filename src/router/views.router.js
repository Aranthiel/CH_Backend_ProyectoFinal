import {Router} from "express";
import { 
    getHomeProductsC,
    getRealTimeProductsC
} from '../controller/views.controller.js'


// corregir usando views,router del proyecto que me paso cristian y pasando la logica a views.controller.js

const viewsRouter = Router();

//endpopint GET para obtener TODOS LOS PRODUCTOS
viewsRouter.get('/', getHomeProductsC); 

//endpopint GET para obtener TODOS LOS PRODUCTOS
viewsRouter.get('/realtimeproducts',getRealTimeProductsC); 

export default viewsRouter


