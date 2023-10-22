import { productModel } from './models/products.model.js';


export class ProductsManagerMongoose{   

    async mongooseGetProducts(obj) {
        console.log(obj);
        const {limit, page, sort, query} = obj;
        console.log('sort 1', sort);
        
        //AGGREGATION 

        /* 
        const aggregationPipeline = [];
        const response = {
            status: "success",
            payload: null,
            prevPage: null,
            prevLink: null,            
            page,
            hasPrevPage: false,
            hasNextPage: false,
            nextPage: null,
            nextLink: null,
        };

        aggregationPipeline.push({ $limit: limit });

        aggregationPipeline.push({ $skip: (page - 1) * limit });

        if (sort) {
            if (sort === 'asc') {
                // Si el orden es ascendente, ordenamos por precio ascendente
                aggregationPipeline.push({ $sort: { price: 1 } });
            } else if (sort === 'desc') {
                // Si el orden es descendente, ordenamos por precio descendente
                aggregationPipeline.push({ $sort: { price: -1 } });
            }
        };
        
        if (query) {
            if (query.category) {
                // Si el orden es ascendente, ordenamos por precio ascendente
                aggregationPipeline.push({ $match: { category: query.category }});
            } 
            if (query.status) {
                // Si el orden es descendente, ordenamos por precio descendente
                aggregationPipeline.push({ $match: { status: query.status } });
            }}; */


        //PAGINATION
        let sortBy;
        if (sort === 'asc') {
            console.log(`el valor de sort es asc y deberia ser {price: 1}`)
            // Si el orden es ascendente, ordenamos por precio ascendente
            sortBy={ $sort: { price: 1 } };
        } else if (sort === 'desc') {
            console.log(`el valor de sort es desc y deberia ser {price: -1}`)
            // Si el orden es descendente, ordenamos por precio descendente
            sortBy={ $sort: { price: -1 } } ;
        }
        console.log('sortBy', sortBy)
        const result =await productModel.paginate({}, {limit, page, sortBy}) // si agrego  { limit,  sort, query } se rompe. Tiene por defecto limit = 10
        //console.log('result pm', result)

        // configurar el objeto de respuesta
        const mongoResults = {
            status: "success",
            payload: result.totalDocs, 
            prevPage: result.prevPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            nextPage: result.nextPage,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null,
        }
        //console.log('result.doc:', result.docs);

        return {mongoResults, results: result.docs };
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

