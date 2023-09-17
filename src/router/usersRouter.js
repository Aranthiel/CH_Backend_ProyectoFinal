import {Router} from "express";
import { userstManager } from "../managers/userstManager";
const router = Router();

//endpopint GET para obtener TODOS LOS PRODUCTOS
router.get('/', async (req, res)=>{
    try {
        const products = await userstManager.getProducts();
        if (!products.length){
            res.status(200).json({message: 'No se encontraron productos'})
        } else {
            res.status(200).json({message: 'Productos encontrados', products})
        }
        
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}); 

//endpopint GET para obtener un PRODUCTO POR SU ID
router.get('/:productId', async (req, res)=>{
    const {productId}=req.params;
    try {        
        const productById = await userstManager.getProductById(+productId);
        if (productById){
            res.status(200).json({message: 'Producto encontrado:', productById})
        } else {
            res.status(200).json({message: 'No se encontro el Id de producto solicitado'})
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}); 

//Endpoint POST para APGREGAR PRODUCTO
router.post('/', async (req, res)=>{
    console.log(req.body)
    const nuevoProducto=req.body;

    // Validar que todos los campos sean obligatorios
    if (!nuevoProducto.title || !nuevoProducto.description || !nuevoProducto.price || !nuevoProducto.thumbnail || !nuevoProducto.code || !nuevoProducto.stock) {
        res.status(400).json({ message: 'Todos los campos son obligatorios. No se pudo agregar el producto.' });
        return;
    }

    try {
        const productoAgregado = await userstManager.addProduct(nuevoProducto)
        res.status(201).json({message: 'Producto agregado:', product: productoAgregado})
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}); 

//Endpoint PUT para actualizar un producto por su ID
router.put('/:productId', async (req , res) =>{    
    const {productId}=req.params;
    const newValues= req.body;
    try {
        const response = await userstManager.updateProduct(+productId, newValues)
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
router.delete('/:productId', async (req , res) =>{
    const {productId}=req.params;
    try {
        const response = await userstManager.deleteProduct(+productId)
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