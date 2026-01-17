import express from 'express';
import productsRouter from "./src/Routes/ProductsRoutes.js";
import cartsRouter from "./src/Routes/CartsRoutes.js";


const app = express();
const PORT = 8080;


// Middlaware para pasear JSON 
app.use (express.json());

// rutas 

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.listen(PORT, () => {
   console.log(`Servidor escuchando el puerto: ${PORT}`);
});


