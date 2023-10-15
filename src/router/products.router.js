import {Router} from "express";
import { 
        getAllProductsC,
        getProductByIdC,
        addProductC,
        updateProductC,
        deleteProductC,
} from '../controller/products.controller.js'


const productsRouter = Router();

//endpopint GET para obtener TODOS LOS PRODUCTOS
productsRouter.get('/', getAllProductsC)
//endpopint GET para obtener un PRODUCTO POR SU ID
productsRouter.get('/:pid', getProductByIdC)
//Endpoint POST para APGREGAR PRODUCTO
productsRouter.post('/', addProductC)
//Endpoint PUT para actualizar un producto por su ID
productsRouter.put('/:pid', updateProductC)
//Endpoint DELETE para eliminar un producto por su ID
productsRouter.delete('/:pid',deleteProductC)

export default productsRouter