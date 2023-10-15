import { productsManagerMongoose } from '../dao/mongoManagers/productsM.manager.js';


//funcion intermedia entre router y manager metodo GET para obtener TODOS LOS PRODUCTOS
async function getAllProductsC(limit) {
    limit = limit ? limit : undefined;
    console.log(`Tipo de limit: ${typeof limit}, Valor: ${limit}`);

    try {
        const products = await productsManagerMongoose.mongooseGetProducts(limit);
        if (!products.length) {
            const error = new Error('No se encontraron productos');
            error.statusCode = 404;
            throw error;
        } else {
            return products;
        }
    } catch (error) {
        throw error;
    }
}

//funcion intermedia entre router y manager metodo GET para obtener un PRODUCTO POR SU ID
async function getProductByIdC (req, res){
    const {pid}=req.params;
    console.log(`Tipo de productId en routes: ${typeof pid}, Valor de productId: ${pid}`);
        
    try {        
        const productById = await productsManagerMongoose.mongooseGetProductById(pid);
        if (productById){
            console.log(pid);
            res.status(200).json({success: true, message: 'Producto encontrado:', productById})
            return productById;
        } else {
            res.status(404).json({ success: false, message: 'No se encontro el Id de producto solicitado'})
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 


//funcion intermedia entre router y manager metodo POST para APGREGAR PRODUCTO
async function addProductC (product){
    console.log(product)
    const nuevoProducto=product
    const productoAgregado = await productsManagerMongoose.mongooseAddProduct(nuevoProducto)
    return {success: true, message: 'Producto agregado:', product: productoAgregado}
}; 

//funcion intermedia entre router y manager metodo PUT para actualizar un producto por su ID
async function updateProductC (req , res) {    
    const {pid}=req.params;
    const newValues= req.body;
    const updatedProduct = await productsManagerMongoose.mongooseUpdateProduct(pid, newValues);
    return updatedProduct;
};

//funcion intermedia entre router y manager metodo DELETE para eliminar un producto por su ID
async function deleteProductC(pid) {
    try {
        const response = await productsManagerMongoose.mongooseDeleteProduct(pid);
        if (response) {
            return { success: true, message: 'Producto eliminado con éxito' };
        } else {
            return { success: false, message: 'No se encontró el producto con el ID proporcionado' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}


export {
    getAllProductsC,
    getProductByIdC,
    addProductC,
    updateProductC,
    deleteProductC,
    }
