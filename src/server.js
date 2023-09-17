/// EXPRESS
//const express= require('express);
import express from 'express';
import productsRouter from "./router/products.router";
import cartRouter from "./router/cart.router";
import usersRouter from "./router/"
import viewsRouter from "./router/views.router";
import { __dirname } from "./utils.js";
//import {engine} from 'express-handlebars';

const app = express();
const port=8080;

//Middleware para que Express pueda analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));


// routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", usersRouter);
app.use('/api',viewsRouter)


// Inicia el servidor
app.listen(port, ()=>(
    console.log(`Pruebas server express. Servidor escuchando en http://localhost:${port}`)
));
