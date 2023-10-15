import { productModel } from './models/products.model.js';


export class ProductsManagerMongoose{   

    async mongooseGetProducts(limit) {
        limit ? limit : 15;
        const productsList = await productModel.find().limit(limit);
        return productsList;
    }
        
    async mongooseGetProductById(pid){
        try {
            const product = await productModel.findById(pid);            
            
            if(!product){
                //return `ERROR:NOT FOUND. El producto ${productId} NO se encuentra en el listado de productos, por favor ingrese un producto válido`;
                console.log(`ERROR:NOT FOUND. El producto ${pid} NO se encuentra en el listado de productos, por favor ingrese un producto válido`);
                return null; // Devuelve null en lugar de una cadena de error
        
            } else {
                return product;
            };
            
        } catch (error) {
            return error
        }
    };    
    
    async mongooseAddProduct(obj){
        try {
            const newProduct= await productModel.create(obj);  // zoom  1:20hs ver video desde ahi          
            return newProduct;
        } catch (error) {
            return error
        }
    };
    
    async mongooseUpdateProduct(pid, obj){
        console.log("Antes de la actualización: ID del producto =", pid);
        console.log("Datos de actualización =", obj);

        try {
            // Buscar el producto a actualizar por su ID
            let product = await productModel.updateOne({ _id: pid },obj);

            if (!product) {
                // Producto no encontrado, devuelve null
                return null;
            }
            // Retorna el producto actualizado
            return product;
    
        } catch (error) {
            return error;
        }
    };
        
    async mongooseDeleteProduct(pid){
            const product = await productModel.findByIdAndDelete(pid);
            return product;
    };
};

export const productsManagerMongoose= new ProductsManagerMongoose('productos.json');

