import { productsManager } from '../../dao/fsmanagers/ProductsManager.js';
import { completeProductValidator } from "../../middlewares/validators.js";


//funcion intermedia entre router y manager metodo GET para obtener TODOS LOS PRODUCTOS
async function getAllProductsC (req, res)  {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;    
    console.log(`Tipo de limit: ${typeof limit}, Valor: ${limit}`);   

    try {
        const products = await productsManager.getProducts(+limit);
        if (!products.length){
            res.status(404).json({ success: false, message: 'No se encontraron productos'})
        } else {
            res.status(200).json({success: true, message: 'Productos encontrados con el metodo async function getAllProductsC en products.controller', products})
            return products;
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        
    }
}; 

//funcion intermedia entre router y manager metodo GET para obtener un PRODUCTO POR SU ID
async function getProductByIdC (req, res){
    const {pid}=req.params;
    console.log(`Tipo de productId en routes: ${typeof pid}, Valor de productId: ${pid}`);
        
    try {        
        const productById = await productsManager.getProductById(+pid);
        if (productById){
            console.log(pid);
            res.status(200).json({success: true, message: 'Producto encontrado:', productById})
        } else {
            res.status(404).json({ success: false, message: 'No se encontro el Id de producto solicitado'})
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 


//funcion intermedia entre router y manager metodo POST para APGREGAR PRODUCTO
async function addProductC (req, res){
    console.log(req.body)
    const nuevoProducto=req.body; 
    if (completeProductValidator(nuevoProducto)){ // verifica que el nuevo Producto tenga todos los campos obligatorios en el formato correcto
        try {
            const productoAgregado = await productsManager.addProduct(nuevoProducto)
            res.status(201).json({success: true, message: 'Producto agregado:', product: productoAgregado})
        } catch (error) {
            res.status(500).json({  success: false, message: error.message });
            
        }
    } else {
        res.status(400).json({  success: false, message: 'No se pudo agregar el producto debido a datos incorrectos o faltantes.' });
    }   
}; 

//funcion intermedia entre router y manager metodo PUT para actualizar un producto por su ID
async function updateProductC (req , res) {    
    const {pid}=req.params;
    const newValues= req.body;
    try {
        const response = await productsManager.updateProduct(+pid, newValues)
        if (response === null) {
            res.status(404).json({  success: false, message: 'No se encontró el producto con el ID proporcionado' });            
        } else {
            res.status(200).json({success: true, message: 'Producto actualizado con éxito', product: response});
        }
    } catch (error) {
        res.status(500).json({  success: false, message: error.message });
    }

};

//funcion intermedia entre router y manager metodo DELETE para eliminar un producto por su ID
async function deleteProductC (req , res) {
    const {pid}=req.params;
    try {
        const response = await productsManager.deleteProduct(pid)
        if (response===true) {
            res.status(200).json({success: true, message: 'Producto eliminado con éxito' });
        } else {
            res.status(404).json({  success: false, message: 'No se encontró el producto con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({  success: false, message: error.message });
    }

};

export {
    getAllProductsC,
    getProductByIdC,
    addProductC,
    updateProductC,
    deleteProductC,
    }
