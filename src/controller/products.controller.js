import { productsManagerMongoose } from '../dao/mongoManagers/productsM.manager.js';


//funcion intermedia entre router y manager metodo GET para obtener TODOS LOS PRODUCTOS
async function getAllProductsC(req, res) {
    try {
        const response = await productsManagerMongoose.mongooseGetProducts(req.query);
        //console.log('response en GAP', response)
        if (response.mongoResults.status !== "success") {
            res.status(404).json({ success: false, message: 'No se encontraron productos'});
        } else {
            //res.json({response})
            const info = response.mongoResults;
            const products=response.results;
            //console.log('products', products);
            res.status(200).json({success: true, message: `Productos encontrados ${response.mongoResults.payload}`, info, products}); 
            return products;

            //res.status(200).json({success: true, message: `Productos encontrados ${response.payload}` , products}); 
            //return products;
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        //throw error;
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
async function addProductC (req, res){
    const nuevoProducto=req.body
    try {
        const productoAgregado = await productsManagerMongoose.mongooseAddProduct(nuevoProducto);
        res.status(201).json({success: true, message: 'Producto agregado:', product: productoAgregado})
    } catch (error) {
        res.status(500).json({  success: false, message: error.message });
    }
    //¿y el eror 400??? como lo pongo??
}; 

//funcion intermedia entre router y manager metodo PUT para actualizar un producto por su ID
async function updateProductC (req , res) {    
    const {pid}=req.params;
    const obj= req.body;
    try {
        const updatedProduct = await productsManagerMongoose.mongooseUpdateProduct(pid, obj);
         console.log('updatedProduct en controller', updatedProduct);
         res.status(201).json({success: true, message: 'Producto morificado :', product: updatedProduct})
        //return updatedProduct;        
    } catch (error) {
        res.status(500).json({  success: false, message: error.message });
    }
};

//funcion intermedia entre router y manager metodo DELETE para eliminar un producto por su ID
async function deleteProductC(req, res) {
    const { pid } = req.params;
    console.log('pid controller deleteProductC', pid);
    try {
        const response = await productsManagerMongoose.mongooseDeleteProduct(pid);
        if (response) {
            res.status(200).json({ success: true, message: 'Producto eliminado con éxito', product: response });
        } else {
            res.status(404).json({ success: false, message: 'No se encontró el producto con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}



export {
    getAllProductsC,
    getProductByIdC,
    addProductC,
    updateProductC,
    deleteProductC,
    }
