import fs from 'fs';
import { writeDataToFile } from './utils.managers';

export class ProductsManager{
    /*Debe crearse desde su contructor con el elemento products, el cual será un arreglo vacío */

    constructor(path){ 
        /* la clase debe contar con una varuiable this.path el cual se inicializara desde el contructor y debe recibir la ruta a trabajar desde el momento de generar su instancia*/
        this.path=path;       
        //this.products=[]
    }

    /* Debe contar con un metodo getProducts el cual debe devolver un arreglo vacio o el arreglo con todos los productos creados hasta el momento */
    async getProducts(){
        try {
            if (fs.existsSync(this.path)){
                const info = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(info);
            } else {
                return [];
            };            
        } catch (error) {
            return error;            
        };
    };

    /* Debe contar con un metodo getProductById el cual debe buscar en el arreglo el producto que coincida con el id */
    async getProductById(productId){
        try {
            const products = await this.getProducts();
            const product = products.find(product => product.id === productId);
            if(!product){
                //return `ERROR:NOT FOUND. El producto ${productId} NO se encuentra en el listado de productos, por favor ingrese un producto válido`;
                console.log(`ERROR:NOT FOUND. El producto ${productId} NO se encuentra en el listado de productos, por favor ingrese un producto válido`);
                return null; // Devuelve null en lugar de una cadena de error
        
            } else {
                return product;
            };
            
        } catch (error) {
            return error
        }
    };
    
    /* Debe tener un método addProduct que debe recibir un objeto con el formato previamente especificado y asignarle un id autoincrementable y guardarlo en un arreglo*/
    async addProduct(obj){
        try {
            const products = await this.getProducts();            
            
            // Validar que no se repita el campo code
            if (products.find(e => e.code === obj.code)) {
                console.log(`El código de producto ${obj.code} ya existe y no se puede utilizar`);
                return;
            }

            // Asignar un ID autoincremental al producto
            if (!products.length) {
                // Si el arreglo de productos está vacío, asigna el ID 1
                obj.id = 1;
            } else {
                obj.id = products[products.length-1].id+1;
            }

            // Agregar el producto al arreglo
            products.push(obj);
            await writeDataToFile(this.path, products);
        } catch (error) {
            return error
        }
    };
    
    async updateProduct(productId, newValue){
        try {
            // Buscar el producto a actualizar por su ID
            let product = await this.getProductById(productId);
            
            product = { ...product, ...newValue, id: productId};
            
            //Recuperar el arreglo de productos
            const products = await this.getProducts();
    
            // Encontrar el índice del producto en el arreglo
            const productIndex = products.findIndex(p => p.id === productId);    
            // console.log('Índice del producto a actualizar:', productIndex);
    
            // Crear un nuevo array con el producto actualizado usando map
            const productsNew = products.map((p, index) => {
                // comprobar si este es el producto que queremos actualizar
                if (index === productIndex) {
                    // Devuelve el producto actualizado
                    return product;
                } else {
                    // Devuelve el producto original sin cambios
                    return p;
                }
            });
    
            // Sobreescribir el archivo .json
            await writeDataToFile(this.path, productsNew);

            // Retorna el producto actualizado
            return product;
    
        } catch (error) {
            return error;
        }
    };
    
    
    async deleteProduct(productId){
        try {
            // Verifica la existencia del producto
            const product = await this.getProductById(productId);

            // devuelve false si el producto no existe
            if (!product){
                return false
            } 
            
            const products = await this.getProducts()
            const productsNew = products.filter(prod=>prod.id!==productId)
            await writeDataToFile(this.path, productsNew);
            return true;
        } catch (error) {
            return error;    
        }
    };
};

export const productsManager= new ProductsManager('../Products.json');

