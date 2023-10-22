import { productsManager } from '../dao/fsmanagers/ProductsManager.js';
import {productsManagerMongoose} from '../dao/mongoManagers/productsM.manager.js';
import {cartManagerMongoose }from '../dao/mongoManagers/cartM.manager.js';

async function getHomeProductsC (req, res){
    console.log('views.controller.js metodo getHomeProductsC')
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;    
    console.log(`Tipo de limit: ${typeof limit}, Valor: ${limit}`);   

    try {
        const products = await productsManager.getProducts(+limit);
        if (!products.length){
            res.status(404).json({ success: false, message: 'No se encontraron productos'})
        } else {
            //res.status(200).render("home", {products});
            //res.render("home", {products});
            res.render("chat");
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}; 

async function getRealTimeProductsC (req, res){
    console.log('views.controller.js metodo getRealTimeProductsC')
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;    
    console.log(`Tipo de limit: ${typeof limit}, Valor: ${limit}`);   

    try {
        const products = await productsManager.getProducts(+limit);
        if (!products.length){
            res.status(404).json({ success: false, message: 'No se encontraron productos'})
        } else {
            res.status(200).render("realTimeProducts", {products});
            //res.render("home", {products})
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        
    }
}; 

async function productCardRender (req, res){
    console.log('views.controller.js metodo productCardRender')

    try {
        const response = await productsManagerMongoose.mongooseGetProducts(req.query);
        //console.log('response en GAP', response)
        if (response.mongoResults.status !== "success") {
            res.status(404).json({ success: false, message: 'No se encontraron productos'});
        } else {
            //res.json({response})
            const info = response.mongoResults;
            const products=response.results;
            console.log('products', products);
            res.status(200).render("products", {products});
            //res.render("home", {products})
        }
        
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        
    }
}

async function getCartsC (req, res){
    console.log('views.controller.js metodo getCartsC')

}

async function getCartByIdC (req, res){
    console.log('views.controller.js metodo getCartByIdC')

}


export {
    getHomeProductsC,
    getRealTimeProductsC,    
    productCardRender,
    getCartsC,
    getCartByIdC
    }