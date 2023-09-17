import {Router} from "express";
import { productsManager } from "../managers/ProductsManager";
import { completeProductValidator } from "../validators/validators";
const router = Router();

//endpopint GET para obtener TODOS LOS PRODUCTOS
router.get('/', async (req, res)=>{
    const { limit } = req.query;
    try {
        const products = await productsManager.getProducts(limit);
        if (!products.length){
            res.status(404).json({message: 'No se encontraron productos'})
        } else {
            res.status(200).json({message: 'Productos encontrados', products})
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}); 

//endpopint GET para obtener un PRODUCTO POR SU ID
router.get('/:pid', async (req, res)=>{
    const {productId}=req.params;
    try {        
        const productById = await productsManager.getProductById(+productId);
        if (productById){
            res.status(200).json({message: 'Producto encontrado:', productById})
        } else {
            res.status(404).json({message: 'No se encontro el Id de producto solicitado'})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 


//Endpoint POST para APGREGAR PRODUCTO
router.post('/', async (req, res)=>{
    console.log(req.body)
    const nuevoProducto=req.body; 
    if (completeProductValidator(nuevoProducto)){ // verifica que el nuevo Producto tenga todos los campos obligatorios en el formato correcto
        try {
            const productoAgregado = await productsManager.addProduct(nuevoProducto)
            res.status(201).json({message: 'Producto agregado:', product: productoAgregado})
        } catch (error) {
            res.status(500).json({ message: error.message });
            
        }
    }    
}); 

//Endpoint PUT para actualizar un producto por su ID
router.put('/:pid', async (req , res) =>{    
    const {productId}=req.params;
    const newValues= req.body;
    try {
        const response = await productsManager.updateProduct(+productId, newValues)
        if (response) {
            res.status(200).json({ message: 'Producto actualizado con éxito', product: response});
        } else {
            res.status(404).json({ message: 'No se encontró el producto con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});

//Endpoint DELETE para eliminar un producto por su ID
router.delete('/:pid', async (req , res) =>{
    const {productId}=req.params;
    try {
        const response = await productsManager.deleteProduct(+productId)
        if (response===true) {
            res.status(200).json({ message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({ message: 'No se encontró el producto con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});


export default router