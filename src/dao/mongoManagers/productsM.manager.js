import { productModel } from './models/products.model.js';


export class ProductsManagerMongoose{   

    async mongooseGetProducts(limit=10, page=1, query, sort) {

        const aggregationPipeline = [];

        aggregationPipeline.push({ $limit: limit });
        aggregationPipeline.push({ $skip: (page - 1) * limit });


        if (query) {
            if (query.category) {
                // Si el orden es ascendente, ordenamos por precio ascendente
                aggregationPipeline.push({ $match: { category: query.category }});
            } 
            if (query.status) {
                // Si el orden es descendente, ordenamos por precio descendente
                aggregationPipeline.push({ $match: { status: query.status } });
            }}

        // Agregar etapa de ordenamiento si se proporciona sort
        if (sort) {
            if (sort === 'asc') {
                // Si el orden es ascendente, ordenamos por precio ascendente
                aggregationPipeline.push({ $sort: { price: 1 } });
            } else if (sort === 'desc') {
                // Si el orden es descendente, ordenamos por precio descendente
                aggregationPipeline.push({ $sort: { price: -1 } });
            }
        }
    
        const productsList = await productModel.aggregate(aggregationPipeline);
    
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
            let response = await productModel.updateOne({ _id: pid },obj);
            console.log('response en manager', response);
            if (!response) {
                // Producto no encontrado, devuelve null
                return null;
            }
            // Retorna el producto actualizado
            return response;
    
        } catch (error) {
            return error;
        }
    };
        
    async mongooseDeleteProduct(pid){
        console.log('deleteProduct pid manager', pid);
        const product = await productModel.findByIdAndDelete(pid);
        console.log('deleteProduct respone manager', product);
        return product;
    };
};

export const productsManagerMongoose= new ProductsManagerMongoose('productos.json');

