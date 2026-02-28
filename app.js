import express from 'express';
import http from "http";
import {Server} from "socket.io";
import { engine } from 'express-handlebars';
import viewsRouter from './src/Routes/views.router.js';
import productsRouter from "./src/Routes/ProductsRoutes.js";
import cartsRouter from "./src/Routes/CartsRoutes.js";
import ProductManager from './src/manager/ProductManager.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const productManager = new ProductManager(
   new URL("./data/products.json", import.meta.url)
);

// Middlaware para pasear JSON 
app.use (express.json());
app.use(express.urlencoded({extended: true }));

//configuaracion socket io 

io.on('connection', async (socket) => {
   console.log('nuevo cliente se conecto');
   const products = await productManager.getProducts();
   socket.emit('products', products);


socket.on ('product:create', async (payload) => {
   const title = String(payload?.title || "").trim();
   const description = String(payload?.description || "").trim();
   const price = Number(payload?.price);
   const stock = Number(payload?.stock);
   
   if (!title || !description || Number.isNaN(price) || Number.isNaN(stock)) {
       return;
   }

   await productManager.addProduct({ title, description, price, stock });
   const updatedProducts = await productManager.getProducts();
   io.emit('products', updatedProducts);
});

socket.on("product:delete", async (id) => {
   const productId = Number(id);
   if(Number.isNaN(productId)){
      return;
   }
    const removed = await productManager.deleteProduct(productId);
    if(!removed){
      return;
    }



    const updatedProducts = await productManager.getProducts();
    io.emit("products", updatedProducts);    
});
});

// configuracion de handlebars

app.engine ( "handlebars", engine ({
   layoutsDir:"./src/views/layout", 
   defaultLayout: 'main'
})
);
app.set("view engine", 'handlebars');
app.set("views", "./src/views");



// rutas 

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("", viewsRouter(productManager));



server.listen(8080, () => {
   console.log("Servidor iniciado correctamente");
});


